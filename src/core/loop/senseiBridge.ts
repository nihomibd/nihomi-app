// src/core/loop/senseiBridge.ts
// NIHOMI Sensei AI Adapter Bridge — Nomi Sensei Pedagogical Coaching Integration
// Implements Dignified Mistake Recovery (Law 5) & Strict Cumulative Lattice AI Boundary (Law 6)
// Governed by .agents/rules/nihomi-pedagogy.md and docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md

import { NihomiDomain, ActivityAttemptResult } from '../adapters/types';
import { LearnerKnowledgeState } from '../curriculum/learnerKnowledgeState';
import { assertSenseiOutputEligible, senseiRegistry } from '../ai/senseiProvider';

export interface SenseiCoachingAdvice {
  domain: NihomiDomain;
  headlineBn: string;
  coachingMessageBn: string;
  recoveryTipBn?: string;
  encouragementBn: string;
  passedLatticeAudit: boolean;
  violations: string[];
}

export class SenseiLoopBridge {
  /**
   * Generates warm introductory pedagogical briefing for an upcoming learning activity.
   */
  async generateActivityBriefing(
    domain: NihomiDomain,
    activity: any,
    state: LearnerKnowledgeState
  ): Promise<SenseiCoachingAdvice> {
    let headlineBn = 'নমি সেন্সেই ব্রিফিং';
    let coachingMessageBn = '';
    let encouragementBn = 'এক পা এক পা করে আমরা জাপানের পথে এগিয়ে যাচ্ছি!';

    switch (domain) {
      case 'japanese-learning': {
        const char = activity.targetChar || 'あ';
        headlineBn = `হিরাগানা '${char}' ক্যালিগ্রাফি ও উচ্চারণ`;
        coachingMessageBn = `আজকের লক্ষ্য হিরাগানা '${char}' আয়ত্ত করা। প্রতিটি স্ট্রোকের দিক ও ভারসাম্য মনোযোগ দিয়ে খেয়াল করুন।`;
        encouragementBn = 'ধীরেসুস্থে প্রতিটি রেখা আঁকুন, কোনো তাড়াহুড়ো নেই!';
        break;
      }
      case 'pos-simulation': {
        headlineBn = '৭-ইলেভেন কনবিনি ক্যাশিয়ার শিফট ব্রিফিং';
        coachingMessageBn =
          'টোকিও ৭-ইলেভেনে গ্রাহকের আগমন থেকে শুরু করে বিদায় পর্যন্ত প্রামাণ্য ৫টি ধাপ নিখুঁতভাবে শেষ করুন। মুখে সবসময় মিষ্টি হাসি ও বিনীত কণ্ঠ রাখবেন।';
        encouragementBn = 'জাপানিজ কর্মক্ষেত্রের এটিকেট অত্যন্ত সহজ, শুধু মনোযোগ দিয়ে ধাপগুলো শেষ করুন!';
        break;
      }
      case 'exam-os': {
        headlineBn = `JLPT ${activity.level || 'N5'} মক এক্সাম ব্রিফিং`;
        coachingMessageBn =
          'সময় ব্যবস্থাপনার দিকে বিশেষ লক্ষ্য রাখুন। প্রতিটি প্রশ্নের জন্য নির্দিষ্ট সময় বরাদ্দ রেখে ঠাণ্ডা মাথায় উত্তর দিন।';
        encouragementBn = 'এটি আপনার প্রস্তুতি যাচাইয়ের একটি সুযোগ, আত্মবিশ্বাসের সাথে পরীক্ষা দিন!';
        break;
      }
      case 'cv-rirekisho': {
        headlineBn = 'জেআইএস রিরেকিশো সিভি প্রস্তুতি';
        coachingMessageBn =
          'জাপানিজ স্ট্যান্ডার্ড জীবনবৃত্তান্তে তথ্য সততা ও স্পষ্টতা সবচেয়ে গুরুত্বপূর্ণ। আপনার প্রতিটি তথ্য নির্ভুলভাবে প্রদান করুন।';
        encouragementBn = 'একটি নিখুঁত রিরেকিশো আপনার জাপানে কর্মসংস্থানের প্রথম চাবিকাঠি!';
        break;
      }
      default: {
        coachingMessageBn = 'আজকের অনুশীলন মনোযোগ দিয়ে শুরু করুন!';
      }
    }

    // Strict cumulative lattice boundary audit: allows current target character under study
    const allowedState: LearnerKnowledgeState = {
      ...state,
      knownHiragana: Array.from(
        new Set([...(state.knownHiragana || []), ...(activity?.targetChar ? [activity.targetChar] : [])])
      )
    };
    const audit = assertSenseiOutputEligible(coachingMessageBn, allowedState);

    return {
      domain,
      headlineBn,
      coachingMessageBn: audit.sanitized,
      encouragementBn,
      passedLatticeAudit: audit.eligible,
      violations: audit.violations
    };
  }

  /**
   * Generates dignified mistake recovery micro-coaching or success reinforcement.
   * Never shames the learner; always turns errors into positive learning events.
   */
  async generateAttemptCoaching(
    domain: NihomiDomain,
    activity: any,
    attemptResult: ActivityAttemptResult,
    state: LearnerKnowledgeState
  ): Promise<SenseiCoachingAdvice> {
    const passed = attemptResult.passed;
    let headlineBn = passed ? 'দারুণ সাফল্য! 🎉' : 'মন খারাপের কিছু নেই, আবার চেষ্টা করি! 🌸';
    let coachingMessageBn = '';
    let recoveryTipBn: string | undefined;
    let encouragementBn = '';

    if (passed) {
      coachingMessageBn = `চমৎকার হয়েছে! আপনার পারফরম্যান্স স্কোর: ${attemptResult.score}%। আপনার অগ্রগতি মেমোরিতে যুক্ত হয়েছে।`;
      encouragementBn = 'এই ধারাবাহিকতা বজায় রাখুন, আপনি দ্রুত এগিয়ে যাচ্ছেন!';
    } else {
      encouragementBn = 'ভুল থেকেই সবচেয়ে ভালো শেখা যায়। শান্ত থাকুন, আমরা একসাথে এটি ঠিক করে নেব।';

      switch (domain) {
        case 'japanese-learning': {
          const char = activity.targetChar || 'あ';
          coachingMessageBn = `হিরাগানা '${char}' এর স্ট্রোকে সামান্য অমিল হয়েছে। রেখার দিক ও বাঁক লাল গাইড অনুযায়ী পুনরায় লক্ষ্য করুন।`;
          recoveryTipBn = 'টিপ: ক্যালিগ্রাফি ক্যানভাসে নির্দেশক নম্বর (১, ২, ৩) ক্রমানুসারে আঙুল বা মাউস দিয়ে ট্রেস করুন।';
          break;
        }
        case 'pos-simulation': {
          const weakStep = attemptResult.evaluation?.weakStep || 1;
          coachingMessageBn = `শিফটের ধাপ ${weakStep} এ সামান্য অসতর্কতা হয়েছে। জাপানিজ কেসার্ভিসের এটিকেট খেয়াল রাখুন।`;
          recoveryTipBn = 'টিপ: গ্রাহকের প্রশ্নের উত্তর দেওয়ার সময় বিনয়ী কণ্ঠ ও যথাযথ জাপানিজ ফ্রেজ নির্বাচন করুন।';
          break;
        }
        case 'exam-os': {
          const weakSecs = attemptResult.evaluation?.weakSections || [];
          coachingMessageBn = `মক পরীক্ষায় পাসিং স্কোরের সামান্য নিচে রয়েছে। বিশেষ করে ${
            weakSecs.length > 0 ? weakSecs.join(', ') : 'নির্দিষ্ট সেকশনে'
          } আরও অনুশীলনের সুযোগ রয়েছে।`;
          recoveryTipBn = 'টিপ: ভুল হওয়া প্রশ্নগুলো আপনার রিভিও কিউতে যুক্ত করা হয়েছে, সেগুলোর ব্যাখ্যা মনোযোগ দিয়ে পড়ুন।';
          break;
        }
        case 'cv-rirekisho': {
          const missing = attemptResult.evaluation?.missingRequiredFields || [];
          coachingMessageBn = `রিরেকিশোতে কিছু তথ্য অপূর্ণ রয়েছে (${missing.join(', ')}) অথবা তথ্যের সত্যতা নিশ্চিত করা হয়নি।`;
          recoveryTipBn = 'টিপ: সকল ফিল্ড সত্য ও নির্ভুলভাবে পূরণ করে "তথ্যের সত্যতা নিশ্চিত করছি" বক্সে টিক দিন।';
          break;
        }
        default: {
          coachingMessageBn = attemptResult.feedbackBn || 'পুনরায় অনুশীলন করুন।';
        }
      }
    }

    // Inviolable Rule: Validate output against learner knowledge state + target character under practice
    const allowedState: LearnerKnowledgeState = {
      ...state,
      knownHiragana: Array.from(
        new Set([...(state.knownHiragana || []), ...(activity?.targetChar ? [activity.targetChar] : [])])
      )
    };
    const combinedText = `${coachingMessageBn} ${recoveryTipBn || ''}`;
    const audit = assertSenseiOutputEligible(combinedText, allowedState);

    return {
      domain,
      headlineBn,
      coachingMessageBn: audit.eligible ? coachingMessageBn : audit.sanitized,
      recoveryTipBn,
      encouragementBn,
      passedLatticeAudit: audit.eligible,
      violations: audit.violations
    };
  }
}

export const senseiBridge = new SenseiLoopBridge();
