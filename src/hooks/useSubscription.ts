import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export interface SubscriptionState {
  isPro: boolean;
  tier: 'free' | 'starter' | 'pro' | 'japan_ready' | string;
  isLifetime: boolean;
  canAccessMockExams: boolean;
  canAccess247Ai: boolean;
  planName: string;
}

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();

  return useMemo(() => {
    const planId = user?.planId || 'free';
    const role = user?.role || 'student';

    const isFounderOrAdmin = role === 'admin' || role === 'founder';
    const isProTier = planId === 'pro' || planId === 'japan_ready' || planId === 'n5_pro' || planId === 'lifetime' || isFounderOrAdmin;
    const isLifetime = planId === 'lifetime' || isFounderOrAdmin;

    let planName = 'ফ্রি প্ল্যান (Free Tier)';
    if (isFounderOrAdmin) {
      planName = 'ফাউন্ডার ভিআইপি (Founder VIP)';
    } else if (planId === 'japan_ready') {
      planName = 'নিহোমি জাপান রেডি (Nihomi Japan Ready)';
    } else if (isProTier) {
      planName = 'নিহোমি প্রো (Nihomi Pro)';
    } else if (planId === 'starter') {
      planName = 'নিহোমি স্টারটার (Nihomi Starter)';
    }

    return {
      isPro: isProTier,
      tier: planId,
      isLifetime,
      canAccessMockExams: isProTier,
      canAccess247Ai: isProTier,
      planName,
    };
  }, [user]);
}

export default useSubscription;
