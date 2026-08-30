import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  nameJa?: string;
  phone?: string;
  avatarUrl?: string;
  role: 'student' | 'instructor' | 'admin' | 'founder';
  planId: 'free' | 'starter' | 'pro' | 'japan_ready';
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  studentId: string;
  nihomiAccountId: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  targetLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  targetExam: string;
  targetExamDate: string;
  preferredSensei: string;
  preferredLanguage: string;
  dailyGoalMinutes: number;
}

export interface UserProgress {
  userId: string;
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  streakDays: number;
  totalHours: number;
  completedLessonsCount: number;
}

export interface UserSubscription {
  userId: string;
  planId: 'free' | 'starter' | 'pro' | 'japan_ready';
  planName: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  validUntil: string;
  billingCycle: 'monthly' | 'yearly';
  aiCreditsRemaining: number;
  paymentMethod: 'bkash' | 'sslcommerz' | 'card' | 'eps' | 'paddle';
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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  subscription: UserSubscription | null;
  learningDNA: LearningDNAData | null;
  coinWallet: CoinWalletData | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setUserData: (user: User) => void;
  loginWithGoogleFirebase: () => Promise<boolean>;
  loginWithToken: (idToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile & { name?: string; nameJa?: string; phone?: string }>) => Promise<void>;
  updateSubscriptionPlan: (planId: 'free' | 'starter' | 'pro' | 'japan_ready', method?: 'card' | 'eps' | 'paddle' | 'bkash') => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  progress: null,
  subscription: null,
  learningDNA: null,
  coinWallet: null,
  loading: false,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  setUserData: () => {},
  loginWithGoogleFirebase: async () => false,
  loginWithToken: async () => false,
  logout: async () => {},
  updateProfileData: async () => {},
  updateSubscriptionPlan: async () => {},
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

  const [progress, setProgress] = useState<UserProgress | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_progress');
      return saved ? JSON.parse(saved) : {
        userId: user?.id || 'default_user',
        currentLevel: 'N5',
        streakDays: 7,
        totalHours: 14.5,
        completedLessonsCount: 8,
      };
    } catch {
      return null;
    }
  });

  const [subscription, setSubscription] = useState<UserSubscription | null>(() => {
    try {
      const saved = localStorage.getItem('nihomi_subscription');
      return saved ? JSON.parse(saved) : {
        userId: user?.id || 'default_user',
        planId: user?.planId || 'starter',
        planName: 'Starter Learner',
        status: 'active',
        validUntil: '2026-12-31',
        billingCycle: 'monthly',
        aiCreditsRemaining: 350,
        paymentMethod: 'bkash',
      };
    } catch {
      return null;
    }
  });

  const [learningDNA, setLearningDNA] = useState<LearningDNAData | null>({
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

  const [coinWallet, setCoinWallet] = useState<CoinWalletData | null>({
    userId: user?.id || 'default_user',
    coinBalance: 500,
    lifetimeEarned: 1200,
    lifetimeSpent: 700,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const setUserData = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('nihomi_user', JSON.stringify(newUser));
  };

  const loginWithToken = async (idToken: string): Promise<boolean> => {
    const isTanvir = idToken.includes('mdtanvirkabirbiplob');
    const newUser: User = {
      id: isTanvir ? 'usr_founder_001' : 'usr_student_' + Date.now(),
      email: isTanvir ? 'mdtanvirkabirbiplob@gmail.com' : 'student@nihomi.com',
      name: isTanvir ? 'Tanvir Kabir (Founder)' : 'Nihomi Student',
      role: isTanvir ? 'founder' : 'student',
      planId: isTanvir ? 'japan_ready' : 'starter',
      status: 'ACTIVE',
      studentId: isTanvir ? 'NHO-FND-001' : 'NHO-' + Math.floor(100000 + Math.random() * 900000),
      nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserData(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogleFirebase = async (): Promise<boolean> => {
    return loginWithToken('google-auth-student@nihomi.com');
  };

  const logout = async () => {
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
        localStorage.setItem('nihomi_subscription', JSON.stringify(updatedSub));
      }
    }
  };

  const refreshAuth = useCallback(async () => {}, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        progress,
        subscription,
        learningDNA,
        coinWallet,
        loading: false,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        setUserData,
        loginWithGoogleFirebase,
        loginWithToken,
        logout,
        updateProfileData,
        updateSubscriptionPlan,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);