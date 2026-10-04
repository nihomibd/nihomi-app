// src/core/monetization/monetizationGate.ts
// Canonical Monetization Gate — Nihomi Commercial Policy Engine
// Law 7: Chapters 1–5 Free, Chapter 6+ Dignified Premium Preview

import { trackNihomiEvent } from '../../utils/analytics';

export const MAX_FREE_CHAPTER = 5;

export interface MonetizationGateStatus {
  isRestricted: boolean;
  chapterNumber?: number;
  reasonBn: string;
  planRequired: 'pro' | 'lifetime';
  previewDetails?: {
    titleBn: string;
    descriptionBn: string;
    featuresBn: string[];
  };
}

/**
 * Checks whether a given lesson or chapter requires a premium subscription.
 */
export function checkMonetizationGate(
  lessonId: string,
  isProUser: boolean
): MonetizationGateStatus {
  if (isProUser) {
    return {
      isRestricted: false,
      reasonBn: 'আপনার সাবস্ক্রিপশনে এই অধ্যায়টি সম্পূর্ণ উন্মুক্ত।',
      planRequired: 'pro'
    };
  }

  const normId = String(lessonId || '').toLowerCase().trim();

  // Extract lesson/chapter number if formatted like 'n5-l6', 'lesson-6', 'l6', '6'
  const match = normId.match(/(?:n5-l|lesson-|l)?(\d+)/i);
  const chapterNum = match ? parseInt(match[1], 10) : 1;

  if (chapterNum > MAX_FREE_CHAPTER) {
    trackNihomiEvent('premium_preview_shown', {
      lessonId,
      chapterNumber: chapterNum
    });

    return {
      isRestricted: true,
      chapterNumber: chapterNum,
      reasonBn: `অধ্যায় ০১ থেকে ০৫ পর্যন্ত সবার জন্য সম্পূর্ণ ফ্রি। অধ্যায় ${chapterNum} এবং তার পরবর্তী অ্যাডভান্সড পাঠগুলো N5 Pro মেম্বারশিপের অন্তর্ভুক্ত।`,
      planRequired: 'pro',
      previewDetails: {
        titleBn: `অধ্যায় ০${chapterNum}: অ্যাডভান্সড বাক্য ও কর্মসংস্থান জাপানিজ`,
        descriptionBn: 'এই অধ্যায়ে আপনি ক্রিয়ার রূপান্তর (Verb Conjugation), জটিল বাক্যগঠন এবং জাপানে পার্ট-টাইম কাজের ইন্টারভিউ সংলাপ শিখবেন।',
        featuresBn: [
          'অধ্যায় ০৬–২৫ এর সম্পূর্ণ ভিডিও ও ইন্টারঅ্যাক্টিভ লেসন',
          '২৪/৭ আনলিমিটেড Nihomi Sensei AI™ স্পিকিং পার্টনার',
          'JLPT N5 ফুল-লেংথ অফিশিয়াল রিয়েল মক টেস্ট',
          'জাপান স্টুডেন্ট ও জব ভিসা গাইডলাইন ও প্র্যাকটিস'
        ]
      }
    };
  }

  return {
    isRestricted: false,
    chapterNumber: chapterNum,
    reasonBn: 'ফ্রি ফাউন্ডেশন চ্যাপ্টার উন্মুক্ত।',
    planRequired: 'pro'
  };
}
