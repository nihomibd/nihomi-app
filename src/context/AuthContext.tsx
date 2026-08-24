import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StudentProfile, AuthUser, SubscriptionDetails } from '../types/nihomi';
import { JLPTLevel, UserProfile, UserProgress, EntitlementFeature, PlanId } from '../types';
import { supabase } from '../lib/supabase';

export type { AuthUser, SubscriptionDetails };

export const PLAN_CONFIGS: Record<string, SubscriptionDetails> = {
  free: {
    planId: 'free',
    planName: 'Nihomi Free Starter',
    priceBDT: 0,
    status: 'trial',
    validUntil: '2026-09-30',
    billingCycle: 'monthly',
    aiCreditsRemaining: 15,
    paymentMethod: 'bkash',
    features: ['Minna no Nihongo Lesson 1–5', 'Basic Kanji Grid', '15 AI Interactions/month', 'Community Support'],
    plan: { id: 'free', name: 'Nihomi Free Starter', price: 0 },
    usage: { aiCreditsRemaining: 15, aiCoachQueriesToday: 2, totalTokensUsed: 1200 },
    subscription: { id: 'sub_free', status: 'trial', planId: 'free', currentPeriodEnd: '2026-09-30' }
  },
  starter: {
    planId: 'starter',
    planName: 'Starter Learner',
    priceBDT: 299,
    status: 'active',
    validUntil: '2026-09-30',
    billingCycle: 'monthly',
    aiCreditsRemaining: 50,
    paymentMethod: 'bkash',
    features: ['JLPT N5 Full Syllabus', 'Digital Student ID Passport', '50 AI Sensei Interactions', 'Audio Pronunciation Coach'],
    plan: { id: 'starter', name: 'Starter Learner', price: 299 },
    usage: { aiCreditsRemaining: 50, aiCoachQueriesToday: 5, totalTokensUsed: 4500 },
    subscription: { id: 'sub_starter', status: 'active', planId: 'starter', currentPeriodEnd: '2026-09-30' }
  },
  pro: {
    planId: 'pro',
    planName: 'Nihomi Pro (Monthly)',
    priceBDT: 599,
    status: 'active',
    validUntil: '2026-12-31',
    billingCycle: 'monthly',
    aiCreditsRemaining: 250,
    paymentMethod: 'bkash',
    features: ['JLPT N5–N3 Complete Curriculum', 'Digital Student ID & Verifiable QR', '250 AI Vision & Voice Interactions', 'DILS Classroom Partner Discount', 'Exclusive JLPT Mock Scorecards'],
    plan: { id: 'pro', name: 'Nihomi Pro (Monthly)', price: 599 },
    usage: { aiCreditsRemaining: 250, aiCoachQueriesToday: 12, totalTokensUsed: 18500 },
    subscription: { id: 'sub_pro', status: 'active', planId: 'pro', currentPeriodEnd: '2026-12-31' }
  },
  vip: {
    planId: 'vip',
    planName: 'Japan Ready VIP & Visa Track',
    priceBDT: 999,
    status: 'active',
    validUntil: '2027-08-31',
    billingCycle: 'monthly',
    aiCreditsRemaining: 1000,
    paymentMethod: 'bkash',
    features: ['Everything in Pro', 'Live Cohort Classes with Founder & Native Sensei', '6-Stage Japan Student Visa & COE Support', 'bdTrip24 Guaranteed Student Ticket Fare (46KG Luggage)', 'Tokyo/Osaka Airport Pickup & Dorm Transfer'],
    plan: { id: 'vip', name: 'Japan Ready VIP & Visa Track', price: 999 },
    usage: { aiCreditsRemaining: 1000, aiCoachQueriesToday: 45, totalTokensUsed: 85000 },
    subscription: { id: 'sub_vip', status: 'active', planId: 'vip', currentPeriodEnd: '2027-08-31' }
  }
};

export const DEFAULT_USER: AuthUser = {
  id: 'DILS-2026-N5042',
  nihomiAccountId: 'NHM-880-9972',
  name: 'Md. Tanvir Kabir Biplob',
  full_name: 'Md. Tanvir Kabir Biplob',
  displayName: 'Md. Tanvir Kabir Biplob',
  nameJa: 'タンビル・カビル・ビプロブ',
  email: 'mdtanvirkabirbiplob@gmail.com',
  phone: '+880 17555-34997',
  avatarUrl: '',
  avatar: '',
  enrolledDate: '2026-01-10',
  currentLevel: 'N5',
  targetLevel: 'N5',
  status: 'ACTIVE',
  streakDays: 18,
  totalStudyHours: 124,
  assignedTeacher: 'Sensei Abdur Razzak',
  targetExam: 'JLPT N5 December Session',
  targetExamDate: '2026-12-06',
  role: 'student',
  planId: 'pro'
};

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  subscriptionDetails: any | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass?: string) => Promise<void>;
  register?: (data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<AuthUser>) => void;
  updateSubscription: (planId: 'free' | 'starter' | 'pro' | 'vip', method?: 'bkash' | 'sslcommerz') => void;
  topUpCredits: (amount: number) => void;
  refreshSubscription: () => Promise<void>;
  
  // Compatibility helpers
  profile?: UserProfile | null;
  progress?: UserProgress | null;
  isLoading?: boolean;
  isLoginModalOpen?: boolean;
  authModalMode?: 'login' | 'register';
  setIsLoginModalOpen?: (open: boolean) => void;
  openLoginModal?: (mode?: 'login' | 'register') => void;
  closeLoginModal?: () => void;
  refreshProgress?: () => Promise<void>;
  refreshUser?: () => Promise<void>;
  canAccess?: (feature: EntitlementFeature, context?: { lessonNumber?: number; level?: string }) => boolean;
  activePlanId?: PlanId;
  entitlements?: EntitlementFeature[];
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  token: 'usr-student-001',
  subscriptionDetails: PLAN_CONFIGS['pro'],
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateProfile: () => {},
  updateSubscription: () => {},
  topUpCredits: () => {},
  refreshSubscription: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nihomi_auth_token') || 'usr-student-001';
  });

  const [subscriptionDetails, setSubscriptionDetails] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_subscription');
      return saved ? JSON.parse(saved) : PLAN_CONFIGS['pro'];
    } catch {
      return PLAN_CONFIGS['pro'];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync Supabase Auth session on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: supaUser } }) => {
      if (supaUser) {
        const meta = supaUser.user_metadata || {};
        const fullName = meta.full_name || meta.name || supaUser.email?.split('@')[0] || 'Md. Tanvir Kabir Biplob';
        setUser((prev) => ({
          ...(prev || DEFAULT_USER),
          id: supaUser.id,
          name: fullName,
          full_name: fullName,
          displayName: fullName,
          email: supaUser.email || 'mdtanvirkabirbiplob@gmail.com',
          avatarUrl: meta.avatar_url || meta.picture || prev?.avatarUrl || '',
          avatar: meta.avatar_url || meta.picture || prev?.avatarUrl || '',
          nihomiAccountId: meta.nihomi_account_id || prev?.nihomiAccountId || 'NHM-880-9972',
          role: (meta.role as any) || 'student'
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const fullName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Md. Tanvir Kabir Biplob';
        setUser((prev) => ({
          ...(prev || DEFAULT_USER),
          id: session.user.id,
          name: fullName,
          full_name: fullName,
          displayName: fullName,
          email: session.user.email || 'mdtanvirkabirbiplob@gmail.com',
          avatarUrl: meta.avatar_url || meta.picture || prev?.avatarUrl || '',
          avatar: meta.avatar_url || meta.picture || prev?.avatarUrl || '',
          nihomiAccountId: meta.nihomi_account_id || prev?.nihomiAccountId || 'NHM-880-9972',
          role: (meta.role as any) || 'student'
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nihomi_auth_user', JSON.stringify(user));
      localStorage.setItem('nihomi_auth_token', token || user.id);
    } else {
      localStorage.removeItem('nihomi_auth_user');
      localStorage.removeItem('nihomi_auth_token');
    }
  }, [user, token]);

  useEffect(() => {
    if (subscriptionDetails) {
      localStorage.setItem('nihomi_subscription', JSON.stringify(subscriptionDetails));
    } else {
      localStorage.removeItem('nihomi_subscription');
    }
  }, [subscriptionDetails]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
    } catch (err) {
      console.warn('OAuth redirect failed, using local student identity fallback:', err);
    }

    const googleUser: AuthUser = {
      ...DEFAULT_USER,
      name: 'Md. Tanvir Kabir Biplob',
      full_name: 'Md. Tanvir Kabir Biplob',
      displayName: 'Md. Tanvir Kabir Biplob',
      email: 'mdtanvirkabirbiplob@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      avatar: 'https://lh3.googleusercontent.com/a/default-user'
    };
    setUser(googleUser);
    setToken('token-google-' + Date.now());
    setSubscriptionDetails(PLAN_CONFIGS['pro']);
    setIsAuthModalOpen(false);
  };

  const login = async (email: string) => {
    const loggedUser: AuthUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email
    };
    setUser(loggedUser);
    setToken('token-email-' + Date.now());
    setIsAuthModalOpen(false);
  };

  const register = async (data: any) => {
    const loggedUser: AuthUser = {
      ...DEFAULT_USER,
      email: data.email || DEFAULT_USER.email,
      name: data.displayName || DEFAULT_USER.name,
      full_name: data.displayName || DEFAULT_USER.full_name,
      displayName: data.displayName || DEFAULT_USER.displayName,
      targetLevel: data.targetLevel || 'N5',
      currentLevel: data.targetLevel || 'N5'
    };
    setUser(loggedUser);
    setToken('token-registered-' + Date.now());
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('nihomi_auth_user');
    localStorage.removeItem('nihomi_auth_token');
  };

  const updateProfile = (updatedData: Partial<AuthUser>) => {
    if (!user) return;
    const updated = {
      ...user,
      ...updatedData,
      name: updatedData.name || updatedData.displayName || updatedData.full_name || user.name,
      full_name: updatedData.full_name || updatedData.name || updatedData.displayName || user.full_name,
      displayName: updatedData.displayName || updatedData.name || updatedData.full_name || user.displayName,
      targetLevel: updatedData.targetLevel || updatedData.currentLevel || user.targetLevel,
      currentLevel: updatedData.currentLevel || updatedData.targetLevel || user.currentLevel
    };
    setUser(updated);
    localStorage.setItem('nihomi_auth_user', JSON.stringify(updated));
  };

  const updateSubscription = (planId: 'free' | 'starter' | 'pro' | 'vip', method: 'bkash' | 'sslcommerz' = 'bkash') => {
    const newConfig = {
      ...PLAN_CONFIGS[planId],
      paymentMethod: method,
      status: 'active' as const,
      validUntil: '2027-01-01'
    };
    setSubscriptionDetails(newConfig);
    if (user) {
      const updatedUser = { ...user, planId };
      setUser(updatedUser);
      localStorage.setItem('nihomi_auth_user', JSON.stringify(updatedUser));
    }
    localStorage.setItem('nihomi_subscription', JSON.stringify(newConfig));
  };

  const topUpCredits = (amount: number) => {
    if (!subscriptionDetails) return;
    const updated = {
      ...subscriptionDetails,
      aiCreditsRemaining: (subscriptionDetails.aiCreditsRemaining || 0) + amount
    };
    setSubscriptionDetails(updated);
    localStorage.setItem('nihomi_subscription', JSON.stringify(updated));
  };

  const refreshSubscription = async () => {
    if (subscriptionDetails) {
      setSubscriptionDetails({ ...subscriptionDetails });
    }
  };

  // Compatibility values for existing views
  const profile: UserProfile | null = user ? {
    userId: user.id,
    displayName: user.displayName || user.name,
    nativeLanguage: 'Bengali',
    targetLevel: user.currentLevel || 'N5',
    dailyGoalMinutes: 30,
    avatar: user.avatarUrl || user.avatar,
    nihomiAccountId: user.nihomiAccountId,
    createdAt: user.enrolledDate,
    updatedAt: new Date().toISOString()
  } : null;

  const progress: UserProgress | null = user ? {
    userId: user.id,
    currentLevel: user.currentLevel || 'N5',
    completedLessonIds: ['n5-l1', 'n5-l2', 'n5-l3', 'n5-l4', 'n5-l5', 'n5-l6', 'n5-l7', 'n5-l8', 'n5-l9', 'n5-l10'],
    totalStudyMinutes: (user.totalStudyHours || 124) * 60,
    currentStreak: user.streakDays || 18,
    longestStreak: 25,
    lastActiveDate: new Date().toISOString().split('T')[0],
    experiencePoints: 4850,
    updatedAt: new Date().toISOString()
  } : null;

  const canAccess = () => true;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        subscriptionDetails,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        updateSubscription,
        topUpCredits,
        refreshSubscription,
        profile,
        progress,
        isLoading: false,
        isLoginModalOpen: isAuthModalOpen,
        authModalMode: 'login',
        setIsLoginModalOpen: (open) => {
          if (open) openAuthModal();
          else closeAuthModal();
        },
        openLoginModal: openAuthModal,
        closeLoginModal: closeAuthModal,
        refreshProgress: async () => {},
        refreshUser: async () => {},
        canAccess,
        activePlanId: (subscriptionDetails?.planId as any) || 'pro',
        entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready', 'certificates']
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
