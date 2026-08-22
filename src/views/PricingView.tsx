import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Award,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Gift,
  BadgeCheck,
  Smartphone,
  CreditCard,
  Building2,
  Clock
} from 'lucide-react';
import { Plan, BillingInterval, PlanId } from '../types';
import { billingApi } from '../lib/billingApi';
import { useAuth } from '../context/AuthContext';
import { CheckoutModal } from '../components/CheckoutModal';

interface PricingViewProps {
  onSelectPlan?: (planId: PlanId) => void;
  onNavigate?: (view: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan, onNavigate }) => {
  const { user, activePlanId, refreshSubscription } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialMessage, setTrialMessage] = useState<string | null>(null);
  const [trialError, setTrialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await billingApi.getPlans();
        if (res.success && res.plans) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleStartCheckout = (plan: Plan) => {
    if (plan.id === 'free') {
      if (onNavigate) onNavigate('dashboard');
      return;
    }
    if (!user) {
      if (onNavigate) onNavigate('auth');
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleStartTrial = async () => {
    if (!user) {
      if (onNavigate) onNavigate('auth');
      return;
    }
    setTrialLoading(true);
    setTrialError(null);
    setTrialMessage(null);
    try {
      const res = await billingApi.startTrial('pro');
      setTrialMessage(res.message);
      await refreshSubscription();
    } catch (err: any) {
      setTrialError(err.message || 'Free trial could not be started.');
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8" id="pricing-page">
      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlanForCheckout}
          initialInterval={interval}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            if (onNavigate) onNavigate('dashboard');
          }}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment in Your Japan Career & JLPT Mastery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Simple, Transparent Pricing in Bangladeshi Taka (৳)
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Learn Japanese at your own pace with AI Sensei, pass JLPT N5–N3, and unlock visa & career opportunities in Japan. Cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-zinc-200 dark:bg-zinc-800 p-1.5 rounded-2xl flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setInterval('monthly')}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  interval === 'monthly'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-monthly"
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setInterval('yearly')}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  interval === 'yearly'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-yearly"
              >
                <span>Annual Billing</span>
                <span className="text-[11px] bg-red-700 text-white px-2 py-0.5 rounded-full font-extrabold">
                  Save up to 30%
                </span>
              </button>
            </div>
          </div>

          {trialMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              {trialMessage}
            </div>
          )}
          {trialError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 font-medium">
              {trialError}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.isPopular;
            const isCurrent = activePlanId === plan.id;
            const price = interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyEquivalent = interval === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all ${
                  isPopular
                    ? 'bg-white dark:bg-zinc-900 border-2 border-red-500 dark:border-red-600 shadow-xl shadow-red-500/5 ring-4 ring-red-500/10'
                    : 'bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-md'
                }`}
                id={`plan-card-${plan.id}`}
              >
                {/* Popular / Best Value Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Meta */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {plan.displayNameJa}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 min-h-[36px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-6 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
                        {plan.id === 'free' ? '৳0' : `৳${price.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {plan.id === 'free' ? '/forever' : interval === 'yearly' ? '/year' : '/month'}
                      </span>
                    </div>

                    {plan.id !== 'free' && interval === 'yearly' && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        Equivalent to only ৳{monthlyEquivalent}/month
                      </p>
                    )}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleStartCheckout(plan)}
                    disabled={isCurrent && plan.id !== 'free'}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : isPopular
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900'
                    }`}
                    id={`btn-choose-plan-${plan.id}`}
                  >
                    <span>{isCurrent ? 'Active Plan' : plan.id === 'free' ? 'Continue Free' : `Upgrade to ${plan.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Free Trial Button for Pro */}
                  {plan.id === 'pro' && activePlanId === 'free' && (
                    <button
                      type="button"
                      onClick={handleStartTrial}
                      disabled={trialLoading}
                      className="w-full py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      id="btn-start-7day-trial"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Start 7-Day Free Trial</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges: Bangladesh Gateways */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Authorized Bangladesh Payment Methods
            </h4>
            <p className="text-xs text-zinc-500">
              Instant activation via bKash Personal & Merchant, SSLCommerz, Nagad, Visa, Mastercard, and American Express.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-bold text-xs">
              bKash MFS
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs">
              SSLCommerz (Cards & NetBanking)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-bold text-xs">
              Nagad / Rocket
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              256-Bit SSL Encrypted
            </div>
          </div>
        </div>

        {/* Detailed Comparison Matrix */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Detailed Feature Comparison</h2>
            <p className="text-xs text-zinc-500">Compare every feature and entitlement side-by-side</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Feature / Curriculum</th>
                    <th className="py-3 px-3 text-center">Free (৳0)</th>
                    <th className="py-3 px-3 text-center">Starter (৳299/mo)</th>
                    <th className="py-3 px-3 text-center bg-red-500/5 text-red-600">Pro (৳599/mo)</th>
                    <th className="py-3 px-3 text-center">Japan Ready (৳999/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      JLPT N5 Curriculum (Foundations)
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-500">Intro Only (Lessons 1-2)</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full 10 Lessons</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full 10 Lessons</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full 10 Lessons</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      JLPT N4 & N3 Intermediate Levels
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full Access</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full Access</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      AI Sensei Coaching Monthly Quota
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-600">10 queries / mo</td>
                    <td className="py-3 px-3 text-center text-zinc-800 dark:text-zinc-200">100 queries / mo</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-red-600 font-bold">1,000 queries / mo</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Unlimited Fast Quota</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Timed Mock Exams & Score Breakdown
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400">1 practice quiz</td>
                    <td className="py-3 px-3 text-center text-zinc-800 dark:text-zinc-200">Basic Quizzes</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full JLPT Pro Exams</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full JLPT Pro Exams</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Business Japanese & Workplace Keigo
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Complete Modules</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Japan Job Interview Simulator (IT / Caregiving / Hospitality)
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full Simulator</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Verifiable Course Completion Certificate
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Included + Verified ID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-500">Everything you need to know about billing, payments, and renewals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Can I pay using bKash or Nagad?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Yes! We support bKash Tokenized Checkout and all major local mobile financial services, allowing you to pay instantly in BDT without needing an international credit card.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">How does the 7-day free trial work?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                New students can activate a 7-day free trial of the Pro Plan with one click. You get unrestricted access to N5–N3 lessons and AI Sensei.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Can I cancel or switch plans anytime?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Absolutely. You can cancel your subscription with a single click from the Billing area. Your access will remain active until the end of the paid period.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Do I get an official tax invoice?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Yes. Every settled payment automatically generates an official invoice with BIN registration details, printable directly for personal or corporate sponsorship records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
