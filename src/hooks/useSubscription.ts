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

    const isFounderOrAdmin = role === 'admin' || role === 'founder' || user?.email === 'mdtanvirkabirbiplob@gmail.com';
    const isProTier = planId === 'pro' || planId === 'japan_ready' || planId === 'n5_pro' || planId === 'lifetime' || isFounderOrAdmin;
    const isLifetime = planId === 'japan_ready' || planId === 'lifetime' || isFounderOrAdmin;

    let planName = 'ফ্রি প্ল্যান (Free Tier)';
    if (isLifetime) {
      planName = 'লাইফটাইম আনলিমিটেড (Lifetime Access)';
    } else if (isProTier) {
      planName = 'N5 Pro মেম্বারশিপ';
    } else if (planId === 'starter') {
      planName = 'স্টার্টার প্ল্যান (Starter)';
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
