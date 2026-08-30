import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  full_name?: string;
  nameJa?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  role: 'student' | 'instructor' | 'admin' | 'founder' | string;
  planId: 'free' | 'starter' | 'pro' | 'japan_ready' | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED' | string;
  studentId: string;
  nihomiAccountId: string;
  country?: string;
  streakDays?: number;
  currentLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  targetLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  enrolledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  name?: string;
  displayName?: string;
  avatar?: string;
  avatarUrl?: string;
  targetLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  currentLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  targetExam: string;
  targetExamDate: string;
  preferredSensei: string;
  preferredLanguage: string;
  nativeLanguage?: string;
  bio?: string;
  dailyGoalMinutes: number;
  nihomiAccountId?: string;
}

export interface UserProgress {
  userId: string;
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  streakDays: number;
  currentStreak?: number;
  longestStreak?: number;
  totalHours: number;
  totalStudyMinutes?: number;
  completedLessonsCount: number;
  completedLessonIds?: string[];
  experiencePoints?: number;
  retentionRate?: number;
  lastActivityDate?: string;
}

export interface UserSubscription {
  userId: string;
  planId: 'free' | 'starter' | 'pro' | 'japan_ready' | string;
  planName: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled' | string;
  validUntil: string;
  billingCycle: 'monthly' | 'yearly' | string;
  aiCreditsRemaining: number;
  paymentMethod: 'bkash' | 'sslcommerz' | 'card' | 'eps' | 'paddle' | string;
  features?: string[];
  subscription?: any;
  usage?: any;
  plan?: any;
}

export interface LearningDNAData {
  userId: string;
  vocabMasteryRate: number;
  grammarMasteryRate: number;
  kanjiMasteryRate: number;
  listeningScore: number;
  speakingScore: number;
  learningVelocity: number;
  diagnosedWeaknesses: Array<{
    category: string;
    item: string;
    description: string;
    frequency: number;
  }>;
  lastPracticedAt: string;
}

export interface CoinWalletData {
  userId: string;
  coinBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export const PLAN_CONFIGS: Record<string, any> = {
  free: {
    planId: 'free',
    planName: 'Nihomi Free Basic',
    priceUSD: 0,
    priceBDT: 0,
    features: ['Hiragana & Katakana Mastery', 'N5 Lessons 1–3 Access', 'Basic Spaced Repetition', 'Community Support'],
  },
  starter: {
    planId: 'starter',
    planName: 'Starter Learner',
    priceUSD: 9,
    priceBDT: 990,
    features: ['Full JLPT N5 Curriculum', 'Standard AI Sensei Q&A', '100 Monthly Nihomi Coins', 'Digital Student ID'],
  },
  pro: {
    planId: 'pro',
    planName: 'Nihomi PRO Learning',
    priceUSD: 19,
    priceBDT: 1990,
    features: ['Complete JLPT N5 + N4 Curriculum', 'Voice & Photo OCR Sensei', '500 Monthly Nihomi Coins', 'Full Learning DNA Memory'],
  },
  japan_ready: {
    planId: 'japan_ready',
    planName: 'Japan Ready Continuous Track',
    priceUSD: 39,
    priceBDT: 3990,
    features: ['Unrestricted N5 to N1 Access', '1,500 Monthly Nihomi Coins', 'Interview & Visa Simulation', 'Priority AI Routing'],
  },
};

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  subscription: UserSubscription | null;
  subscriptionDetails: UserSubscription | null;
  activePlanId: string;
  learningDNA: LearningDNAData | null;
  coinWallet: CoinWalletData | null;
  loading: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: string) => void;
  openLoginModal: (mode?: string) => void;
  closeAuthModal: () => void;
  setUserData: (user: User) => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithGoogleFirebase: () => Promise<boolean>;
  loginWithToken: (idToken: string) => Promise<boolean>;
  login: (email?: string, password?: string) => Promise<boolean>;
  register: (data?: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile & { name?: string; nameJa?: string; phone?: string; displayName?: string; bio?: string; nativeLanguage?: string }>) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateSubscriptionPlan: (planId: 'free' | 'starter' | 'pro' | 'japan_ready' | string, method?: 'card' | 'eps' | 'paddle' | 'bkash' | string) => Promise<void>;
  topUpCredits: (amount: number) => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  progress: null,
  subscription: null,
  subscriptionDetails: null,
  activePlanId: 'starter',
  learningDNA: null,
  coinWallet: null,
  loading: false,
  isLoading: false,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  openLoginModal: () => {},
  closeAuthModal: () => {},
  setUserData: () => {},
  loginWithGoogle: async () => false,
  loginWithGoogleFirebase: async () => false,
  loginWithToken: async () => false,
  login: async () => true,
  register: async () => true,
  logout: async () => {},
  updateProfileData: async () => {},
  updateProfile: async () => {},
  updateSubscriptionPlan: async () => {},
  topUpCredits: async () => {},
  refreshSubscription: async () => {},
  refreshProgress: async () => {},
  refreshUser: async () => {},
  refreshAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_profile');
      return saved ? JSON.parse(saved) : {
        userId: user?.id || 'default_user',
        targetLevel: 'N5',
        targetExam: 'JLPT July 2026',
        targetExamDate: '2026-07-05',
        preferredSensei: 'Yuki (Adaptive)',
        preferredLanguage: 'English',
        dailyGoalMinutes: 30,
      };
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState<UserProgress | null>({
    userId: user?.id || 'default_user',
    currentLevel: 'N5',
    streakDays: 7,
    totalHours: 14.5,
    completedLessonsCount: 8,
  });

  const [subscription, setSubscription] = useState<UserSubscription | null>({
    userId: user?.id || 'default_user',
    planId: user?.planId || 'starter',
    planName: 'Starter Learner',
    status: 'active',
    validUntil: '2026-12-31',
    billingCycle: 'monthly',
    aiCreditsRemaining: 350,
    paymentMethod: 'bkash',
  });

  const [learningDNA] = useState<LearningDNAData | null>({
    userId: user?.id || 'default_user',
    vocabMasteryRate: 78,
    grammarMasteryRate: 82,
    kanjiMasteryRate: 65,
    listeningScore: 74,
    speakingScore: 80,
    learningVelocity: 1.25,
    diagnosedWeaknesses: [
      { category: 'Grammar', item: 'Particle に vs で', description: 'Action location vs destination context', frequency: 3 },
      { category: 'Kanji', item: 'Time & Days', description: 'Onyomi/Kunyomi confusion on 日 and 月', frequency: 2 }
    ],
    lastPracticedAt: new Date().toISOString(),
  });

  const [coinWallet] = useState<CoinWalletData | null>({
    userId: user?.id || 'default_user',
    coinBalance: 500,
    lifetimeEarned: 1200,
    lifetimeSpent: 700,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = (_mode?: string) => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const setUserData = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('nihomi_user', JSON.stringify(newUser));
  };

  // Listen to Supabase Session & extract Google Avatar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const isFounder = u.email === 'mdtanvirkabirbiplob@gmail.com';
        const avatar =
          u.user_metadata?.avatar_url ||
          u.user_metadata?.picture ||
          u.user_metadata?.avatar ||
          undefined;

        const activeUser: User = {
          id: u.id,
          email: u.email || 'student@nihomi.com',
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Nihomi Student',
          avatarUrl: avatar,
          role: isFounder ? 'founder' : 'student',
          planId: isFounder ? 'japan_ready' : 'starter',
          status: 'ACTIVE',
          studentId: 'NHO-' + Math.floor(100000 + Math.random() * 900000),
          nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
          createdAt: u.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUserData(activeUser);
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        const isFounder = u.email === 'mdtanvirkabirbiplob@gmail.com';
        const avatar =
          u.user_metadata?.avatar_url ||
          u.user_metadata?.picture ||
          u.user_metadata?.avatar ||
          undefined;

        const activeUser: User = {
          id: u.id,
          email: u.email || 'student@nihomi.com',
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Nihomi Student',
          avatarUrl: avatar,
          role: isFounder ? 'founder' : 'student',
          planId: isFounder ? 'japan_ready' : 'starter',
          status: 'ACTIVE',
          studentId: 'NHO-' + Math.floor(100000 + Math.random() * 900000),
          nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
          createdAt: u.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUserData(activeUser);
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('nihomi_user');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('[Supabase Google Sign-In Error]:', err);
      return false;
    }
  };

  const loginWithGoogleFirebase = async (): Promise<boolean> => {
    return loginWithGoogle();
  };

  const loginWithToken = async (idToken: string): Promise<boolean> => {
    return loginWithGoogle();
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    localStorage.removeItem('nihomi_user');
  };

  const updateProfileData = async (data: Partial<UserProfile & { name?: string; nameJa?: string; phone?: string }>) => {
    if (profile) {
      const updated = { ...profile, ...data };
      setProfile(updated as UserProfile);
      localStorage.setItem('nihomi_profile', JSON.stringify(updated));
    }
  };

  const updateSubscriptionPlan = async (planId: 'free' | 'starter' | 'pro' | 'japan_ready', method: 'card' | 'eps' | 'paddle' | 'bkash' = 'bkash') => {
    if (user) {
      const updatedUser = { ...user, planId };
      setUserData(updatedUser);
      if (subscription) {
        const updatedSub = { ...subscription, planId, paymentMethod: method };
        setSubscription(updatedSub);
      }
    }
  };

  const login = async () => true;
  const register = async () => true;
  const updateProfile = async (data: any) => updateProfileData(data);
  const topUpCredits = async (amount: number) => {
    if (subscription) {
      setSubscription({
        ...subscription,
        aiCreditsRemaining: (subscription.aiCreditsRemaining || 0) + amount,
      });
    }
  };
  const refreshSubscription = useCallback(async () => {}, []);
  const refreshProgress = useCallback(async () => {}, []);
  const refreshUser = useCallback(async () => {}, []);
  const refreshAuth = useCallback(async () => {}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        progress,
        subscription,
        subscriptionDetails: subscription,
        activePlanId: user?.planId || 'starter',
        learningDNA,
        coinWallet,
        loading: false,
        isLoading: false,
        isAuthModalOpen,
        openAuthModal,
        openLoginModal: openAuthModal,
        closeAuthModal,
        setUserData,
        loginWithGoogle,
        loginWithGoogleFirebase,
        loginWithToken,
        login,
        register,
        logout,
        updateProfileData,
        updateProfile,
        updateSubscriptionPlan,
        topUpCredits,
        refreshSubscription,
        refreshProgress,
        refreshUser,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);