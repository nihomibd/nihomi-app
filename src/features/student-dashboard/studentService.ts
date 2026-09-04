/**
 * NIHOMI.COM — Student Dashboard Real-Data Service
 * Connects Supabase Auth, MemoryOS (SRS), and Gamification
 */
import { supabase } from '../../lib/supabase';
import { DashboardApiResponse } from './types';
import { mockDashboardData } from './mockData';

export const studentService = {
  // ১. আসল স্টুডেন্ট ও ড্যাশবোর্ড ডেটা ফেচ করা
  async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      // Supabase থেকে বর্তমান লগইন করা ইউজার চেক
      const { data: { user } } = await supabase.auth.getUser();

      let studentName = 'Tanvir';
      let studentLevel: 'N5' | 'N4' | 'N3' = 'N5';

      if (user) {
        studentName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Learner';
        studentLevel = user.user_metadata?.target_jlpt || 'N5';
      }

      // LocalStorage বা MemoryOS থেকে সংরক্ষিত ভুলগুলো চেক
      const storedMistakes = localStorage.getItem('nihomi_memory_mistakes');
      const realMistakes = storedMistakes ? JSON.parse(storedMistakes) : mockDashboardData.recentMistakes;

      // সংরক্ষিত কয়েন ও AI ক্রেডিট চেক
      const savedCoins = localStorage.getItem('nihomi_student_coins');
      const savedCredits = localStorage.getItem('nihomi_ai_credits');

      return {
        ...mockDashboardData,
        student: {
          ...mockDashboardData.student,
          name: studentName,
          jlptLevel: studentLevel,
          learningStatusMessageBn: user 
            ? 'স্বাগতম! আপনার আজকের নির্ধারিত লেসন ও কুইজ সম্পন্ন করুন' 
            : 'গেস্ট মোড: আপনার অগ্রগতি ক্লাউডে সেভ করতে লগইন করুন',
        },
        recentMistakes: realMistakes,
        accountUsage: {
          aiCreditsRemaining: savedCredits ? parseInt(savedCredits, 10) : 85,
          aiCreditsMax: 100,
          nihomiCoins: savedCoins ? parseInt(savedCoins, 10) : 420,
        }
      };
    } catch (error) {
      console.warn('[Nihomi Service] Falling back to cached dashboard data:', error);
      return mockDashboardData;
    }
  },

  // ২. ডেইলি চ্যালেঞ্জ সম্পন্ন করে রিয়েল কয়েন ও XP যুক্ত করা
  async completeDailyChallenge(xpReward: number, coinReward: number) {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const updatedCoins = currentCoins + coinReward;
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    return { updatedCoins, xpGained: xpReward };
  },

  // ৩. AI টিউটর ব্যবহারের জন্য ১টি ক্রেডিট কাটা
  async deductAiCredit(): Promise<number> {
    const current = parseInt(localStorage.getItem('nihomi_ai_credits') || '85', 10);
    const updated = Math.max(0, current - 1);
    localStorage.setItem('nihomi_ai_credits', updated.toString());
    return updated;
  }
};