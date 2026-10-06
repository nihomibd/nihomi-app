// src/core/onboarding/onboardingStorage.ts
import { OnboardingAnswers, JapanReadinessBreakdown, CurrentJapaneseLevel } from './onboardingTypes';
import { apiRequest } from '../../lib/api';

const ONBOARDING_ANSWERS_KEY = 'nihomi_onboarding_answers';
const ONBOARDING_COMPLETED_KEY = 'nihomi_onboarding_completed';
const OAUTH_PENDING_KEY = 'nihomi_oauth_pending_onboarding';
const READINESS_SCORE_KEY = 'nihomi_japan_readiness_score';

export const DEFAULT_ONBOARDING_ANSWERS: OnboardingAnswers = {
  reason: 'work',
  currentLevel: 'absolute_beginner',
  timeline: '6_to_12_months',
  prioritySituation: 'konbini',
  dailyMinutes: 20
};

export function saveOnboardingAnswers(answers: OnboardingAnswers): void {
  try {
    if (typeof window !== 'undefined') {
      const payload = {
        ...answers,
        completedAt: answers.completedAt || new Date().toISOString()
      };
      localStorage.setItem(ONBOARDING_ANSWERS_KEY, JSON.stringify(payload));
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      
      const readiness = calculateJapanReadiness(payload);
      localStorage.setItem(READINESS_SCORE_KEY, JSON.stringify(readiness));
      window.dispatchEvent(new CustomEvent('nihomi:onboarding-updated', { detail: payload }));
    }
  } catch (err) {
    console.warn('[OnboardingStorage] Failed to save answers:', err);
  }
}

export function getSavedOnboardingAnswers(): OnboardingAnswers | null {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(ONBOARDING_ANSWERS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {}
  return null;
}

export function isOnboardingCompleted(): boolean {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    }
  } catch {}
  return false;
}

export function markOAuthPendingForOnboarding(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(OAUTH_PENDING_KEY, 'true');
    }
  } catch {}
}

export function checkAndConsumeOAuthPendingOnboarding(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const isPending = localStorage.getItem(OAUTH_PENDING_KEY) === 'true';
      if (isPending) {
        localStorage.removeItem(OAUTH_PENDING_KEY);
        return true;
      }
    }
  } catch {}
  return false;
}

/**
 * Persists onboarding data to authenticated backend profile
 */
export async function syncOnboardingToProfile(answers: OnboardingAnswers): Promise<boolean> {
  try {
    const readiness = calculateJapanReadiness(answers);
    const res = await apiRequest<{ success: boolean; profile?: any }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        dailyGoalMinutes: answers.dailyMinutes,
        onboardingData: answers,
        japanReadinessScore: readiness.overallScore
      })
    });
    return !!res;
  } catch (err) {
    console.warn('[OnboardingStorage] Backend sync warning:', err);
    return false;
  }
}

/**
 * Calculates Japan Readiness™ breakdown
 */
export function calculateJapanReadiness(answers?: OnboardingAnswers | null): JapanReadinessBreakdown {
  const ans = answers || getSavedOnboardingAnswers() || DEFAULT_ONBOARDING_ANSWERS;

  // Base starting scores by current level
  let foundation = 15;
  let speaking = 10;
  let dailyLife = 12;
  let survival = 15;

  switch (ans.currentLevel) {
    case 'absolute_beginner':
      foundation = 15;
      speaking = 10;
      dailyLife = 14;
      survival = 12;
      break;
    case 'know_kana':
      foundation = 38;
      speaking = 18;
      dailyLife = 22;
      survival = 25;
      break;
    case 'know_some_words':
      foundation = 45;
      speaking = 26;
      dailyLife = 30;
      survival = 32;
      break;
    case 'jlpt_n5':
      foundation = 72;
      speaking = 45;
      dailyLife = 50;
      survival = 55;
      break;
    case 'jlpt_n4_plus':
      foundation = 88;
      speaking = 65;
      dailyLife = 70;
      survival = 75;
      break;
  }

  // Bonus for completed missions from localStorage
  try {
    if (typeof window !== 'undefined') {
      const mission1Done = localStorage.getItem('nihomi_mission_konbini_completed') === 'true';
      if (mission1Done) {
        dailyLife = Math.min(100, dailyLife + 15);
        survival = Math.min(100, survival + 15);
        speaking = Math.min(100, speaking + 10);
      }
      const completedLessonsRaw = localStorage.getItem('nihomi_completed_lessons');
      if (completedLessonsRaw) {
        const arr = JSON.parse(completedLessonsRaw);
        if (Array.isArray(arr) && arr.length > 0) {
          foundation = Math.min(100, foundation + arr.length * 8);
        }
      }
    }
  } catch {}

  const overall = Math.round((foundation * 0.35) + (speaking * 0.25) + (dailyLife * 0.20) + (survival * 0.20));

  let targetMilestone = 'মাইলস্টোন ১: তোশিবা কনবিনি ও অভিবাদন';
  if (overall >= 70) {
    targetMilestone = 'মাইলস্টোন ৪: টোকিও লাইফ ও জব ইন্টারভিউ';
  } else if (overall >= 50) {
    targetMilestone = 'মাইলস্টোন ৩: দৈনন্দিন জাপানিজ ও ট্রেন ট্রাভেল';
  } else if (overall >= 30) {
    targetMilestone = 'মাইলস্টোন ২: হিরাগানা ও N5 বেসিক ব্যাকরণ';
  }

  return {
    overallScore: Math.min(100, Math.max(10, overall)),
    foundationScore: Math.min(100, foundation),
    speakingScore: Math.min(100, speaking),
    dailyLifeScore: Math.min(100, dailyLife),
    survivalScore: Math.min(100, survival),
    targetMilestone,
    recommendedDailyMinutes: ans.dailyMinutes || 20
  };
}

export function getLabelForReason(reason: string): string {
  switch (reason) {
    case 'study': return 'উচ্চশিক্ষা (Higher Study)';
    case 'work': return 'চাকরি / SSW ভিসা (Work)';
    case 'language_school': return 'ল্যাঙ্গুয়েজ স্কুল (Language School)';
    case 'travel': return 'ভ্রমণ (Travel)';
    case 'long_term': return 'স্থায়ী বসবাস (Relocation)';
    default: return 'জাপান প্রস্তুতি';
  }
}

export function getLabelForLevel(level: CurrentJapaneseLevel): string {
  switch (level) {
    case 'absolute_beginner': return 'একদম নতুন (Zero Japanese)';
    case 'know_kana': return 'Hiragana/Katakana জানি';
    case 'know_some_words': return 'কিছু শব্দ পারি';
    case 'jlpt_n5': return 'JLPT N5 পাস বা প্রস্তুতি';
    case 'jlpt_n4_plus': return 'JLPT N4 বা তার বেশি';
    default: return 'প্রাথমিক স্তর';
  }
}

export function getLabelForTimeline(timeline: string): string {
  switch (timeline) {
    case '3_to_6_months': return '৩–৬ মাস (শীঘ্রই)';
    case '6_to_12_months': return '৬–১২ মাস (পরিকল্পিত)';
    case '1_to_2_years': return '১–২ বছর (দীর্ঘমেয়াদী)';
    case 'exploring': return 'এখনও ভাবছি (অন্বেষণ)';
    default: return '৬–১২ মাস';
  }
}

export function getLabelForSituation(situation: string): string {
  switch (situation) {
    case 'speaking': return 'আত্মবিশ্বাসের সাথে কথা বলা';
    case 'konbini': return 'কনবিনি ও দোকানে কেনাকাটা';
    case 'train_travel': return 'ট্রেন স্টেশন ও দিকনির্দেশনা';
    case 'restaurant': return 'রেস্তোরাঁয় খাবারের অর্ডার';
    case 'job_interview': return 'বাইতো / জব ইন্টারভিউ';
    default: return 'কনবিনি ও বাস্তব কথোপকথন';
  }
}
