/**
 * NIHOMI MARKETING ANALYTICS & CONVERSION EVENT ENGINE
 * Unified dispatcher for Google Analytics 4 (GA4) and Meta Pixel (Facebook Ads)
 * Optimized for Bangladesh JLPT N5 acquisition campaign.
 * Privacy-safe: Never captures sensitive financial credentials or raw passwords.
 */

import { appendUtmToPayload } from './utm';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type NihomiEventType =
  | 'landing_page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'first_lesson_started'
  | 'first_lesson_completed'
  | 'first_quiz_completed'
  | 'subscription_checkout_started'
  | 'payment_success';

export interface LandingPageViewPayload {
  pagePath?: string;
  source?: string;
  campaign?: string;
}

export interface SignupStartedPayload {
  method?: 'google' | 'email' | 'guest' | string;
}

export interface SignupCompletedPayload {
  userId?: string;
  method?: string;
  role?: string;
  studentId?: string;
}

export interface FirstLessonStartedPayload {
  lessonId: string;
  title?: string;
  level?: string;
}

export interface FirstLessonCompletedPayload {
  lessonId: string;
  title?: string;
  studyMinutes?: number;
  xpReward?: number;
}

export interface FirstQuizCompletedPayload {
  quizId: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  passed?: boolean;
}

export interface SubscriptionCheckoutStartedPayload {
  planId: string;
  planName?: string;
  amount?: number;
  amountBDT?: number;
  interval?: 'monthly' | 'yearly' | string;
  billingInterval?: 'monthly' | 'yearly' | string;
  provider?: 'bkash' | 'sslcommerz' | 'nagad' | string;
  couponCode?: string | null;
}

export interface PaymentSuccessPayload {
  transactionId?: string;
  paymentId?: string;
  invoiceId?: string;
  gateway?: 'bkash' | 'sslcommerz' | 'nagad' | string;
  provider?: 'bkash' | 'sslcommerz' | 'nagad' | string;
  amount?: number;
  amountBDT?: number;
  planId?: string;
  billingInterval?: 'monthly' | 'yearly' | string;
  currency?: string;
}

export type EventPayloadMap = {
  landing_page_view: LandingPageViewPayload;
  signup_started: SignupStartedPayload;
  signup_completed: SignupCompletedPayload;
  first_lesson_started: FirstLessonStartedPayload;
  first_lesson_completed: FirstLessonCompletedPayload;
  first_quiz_completed: FirstQuizCompletedPayload;
  subscription_checkout_started: SubscriptionCheckoutStartedPayload;
  payment_success: PaymentSuccessPayload;
};

/**
 * Filter out any accidentally passed sensitive parameters (passwords, PINs, OTPs, CVVs)
 */
function sanitizePayload(payload: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['password', 'pin', 'otp', 'cardcvv', 'cvv', 'cardnumber', 'token', 'secret'];
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

/**
 * Safe dispatch to Google Analytics 4 (window.gtag)
 */
function dispatchToGA4(eventName: string, params: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.debug('[Analytics] GA4 dispatch exception:', err);
  }
}

/**
 * Safe dispatch to Meta Pixel (window.fbq)
 */
function dispatchToMeta(trackType: 'track' | 'trackCustom', eventName: string, params: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq(trackType, eventName, params);
    }
  } catch (err) {
    console.debug('[Analytics] Meta Pixel dispatch exception:', err);
  }
}

/**
 * Send internal non-blocking telemetry ping
 */
function sendInternalTelemetry(eventType: string, payload: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('nihomi_token');
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        event: eventType,
        properties: payload,
        timestamp: new Date().toISOString()
      }),
      keepalive: true
    }).catch(() => {
      // Ignore background analytics transport errors
    });
  } catch {
    // Non-blocking telemetry
  }
}

/**
 * Main unified analytics event dispatcher
 */
export function trackNihomiEvent<T extends NihomiEventType>(
  eventType: T,
  payload: EventPayloadMap[T]
): void {
  const baseSanitized = sanitizePayload(payload as Record<string, any>);
  const cleanPayload = appendUtmToPayload(baseSanitized);

  if (import.meta.env?.DEV) {
    console.log(`[Nihomi Analytics] 📊 Event: ${eventType}`, cleanPayload);
  }

  // 1. Dispatch according to specific conversion schemas
  switch (eventType) {
    case 'landing_page_view': {
      dispatchToGA4('page_view', {
        page_title: 'Nihomi Japanese Learning Platform',
        page_location: typeof window !== 'undefined' ? window.location.href : '',
        page_path: cleanPayload.pagePath || '/',
        ...cleanPayload
      });
      dispatchToMeta('track', 'PageView', cleanPayload);
      break;
    }

    case 'signup_started': {
      dispatchToGA4('begin_registration', {
        method: cleanPayload.method || 'google'
      });
      dispatchToMeta('trackCustom', 'SignupStarted', cleanPayload);
      break;
    }

    case 'signup_completed': {
      dispatchToGA4('sign_up', {
        method: cleanPayload.method || 'google',
        user_id: cleanPayload.userId
      });
      dispatchToMeta('track', 'CompleteRegistration', {
        content_name: 'Nihomi Student Registration',
        status: true,
        currency: 'BDT',
        value: 0
      });
      break;
    }

    case 'first_lesson_started': {
      dispatchToGA4('first_lesson_started', {
        lesson_id: cleanPayload.lessonId,
        lesson_title: cleanPayload.title || 'Lesson 1 (はじめまして)',
        level: cleanPayload.level || 'N5'
      });
      dispatchToMeta('trackCustom', 'FirstLessonStarted', {
        lesson_id: cleanPayload.lessonId,
        content_category: 'JLPT_N5'
      });
      break;
    }

    case 'first_lesson_completed': {
      // Key activation metric for first 100 Bangladesh learners
      dispatchToGA4('first_lesson_completed', {
        lesson_id: cleanPayload.lessonId,
        lesson_title: cleanPayload.title,
        study_minutes: cleanPayload.studyMinutes || 15,
        xp_reward: cleanPayload.xpReward || 50
      });
      dispatchToMeta('trackCustom', 'FirstLessonCompleted', {
        lesson_id: cleanPayload.lessonId,
        content_name: cleanPayload.title,
        activation_milestone: true
      });
      break;
    }

    case 'first_quiz_completed': {
      dispatchToGA4('first_quiz_completed', {
        quiz_id: cleanPayload.quizId,
        score: cleanPayload.score,
        passed: cleanPayload.passed
      });
      dispatchToMeta('trackCustom', 'FirstQuizCompleted', {
        quiz_id: cleanPayload.quizId,
        score: cleanPayload.score,
        passed: cleanPayload.passed
      });
      break;
    }

    case 'subscription_checkout_started': {
      const amount = cleanPayload.amountBDT || 0;
      dispatchToGA4('begin_checkout', {
        value: amount,
        currency: 'BDT',
        items: [
          {
            item_id: cleanPayload.planId,
            item_name: cleanPayload.planName || 'Nihomi Plan',
            price: amount,
            quantity: 1
          }
        ]
      });
      dispatchToMeta('track', 'InitiateCheckout', {
        value: amount,
        currency: 'BDT',
        content_ids: [cleanPayload.planId],
        content_name: cleanPayload.planName || cleanPayload.planId,
        num_items: 1
      });
      break;
    }

    case 'payment_success': {
      const amount = cleanPayload.amountBDT || 0;
      dispatchToGA4('purchase', {
        transaction_id: cleanPayload.transactionId,
        value: amount,
        currency: cleanPayload.currency || 'BDT',
        payment_type: cleanPayload.gateway,
        items: [
          {
            item_id: cleanPayload.planId || 'nihomi_subscription',
            price: amount,
            quantity: 1
          }
        ]
      });
      dispatchToMeta('track', 'Purchase', {
        value: amount,
        currency: cleanPayload.currency || 'BDT',
        content_type: 'product',
        content_ids: [cleanPayload.planId || 'nihomi_subscription'],
        transaction_id: cleanPayload.transactionId
      });
      break;
    }
  }

  // 2. Internal telemetry dispatch
  sendInternalTelemetry(eventType, cleanPayload);
}

/**
 * PWA Install Event Tracking
 */
export function trackPwaInstallPrompt(source: string = 'web'): void {
  dispatchToGA4('pwa_install_prompt_shown', { prompt_source: source });
  dispatchToMeta('trackCustom', 'PWAInstallPromptShown', { prompt_source: source });
}

export function trackPwaInstallAccepted(platform: string = 'android'): void {
  dispatchToGA4('pwa_install_accepted', { platform });
  dispatchToMeta('trackCustom', 'PWAInstallAccepted', { platform });
}

export function trackPwaInstallDismissed(reason: string = 'user_cancelled'): void {
  dispatchToGA4('pwa_install_dismissed', { reason });
  dispatchToMeta('trackCustom', 'PWAInstallDismissed', { reason });
}

