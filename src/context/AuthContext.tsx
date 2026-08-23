import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserProfile, UserProgress, JLPTLevel, UserSubscriptionDetails, EntitlementFeature, PlanId } from '../types.js';
import { apiRequest, setStoredToken, getStoredToken } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  subscriptionDetails: UserSubscriptionDetails | null;
  activePlanId: PlanId;
  entitlements: EntitlementFeature[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    displayName: string;
    targetLevel: JLPTLevel;
    nativeLanguage?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProgress: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  canAccess: (feature: EntitlementFeature, context?: { lessonNumber?: number; level?: string }) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<UserSubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const data = await apiRequest<UserSubscriptionDetails>('/api/billing/subscription');
      setSubscriptionDetails(data);
    } catch (err) {
      console.warn('Could not fetch subscription details:', err);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setProgress(null);
      setSubscriptionDetails(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest<{
        user: User;
        profile: UserProfile;
        progress: UserProgress;
      }>('/api/auth/me');

      setUser(data.user);
      setProfile(data.profile);
      setProgress(data.progress);

      // Fetch subscription details
      await fetchSubscription();
    } catch (err) {
      console.warn('Session expired or invalid, logging out.', err);
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      setProgress(null);
      setSubscriptionDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubscription]);

  // Handle Supabase Auth state listener for Google OAuth and session persistence
  useEffect(() => {
    // 1. Initial auth check
    fetchCurrentUser();

    // 2. Listen to Supabase auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        setStoredToken(session.access_token);
        if (session.user) {
          const userRole = session.user.email?.includes('admin@nihomi.com') ? 'admin' : 'user';
          setUser({
            id: session.user.id,
            email: session.user.email || 'student@nihomi.com',
            role: userRole,
            name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          });
        }
        await fetchCurrentUser();
      } else if (event === 'SIGNED_OUT') {
        setStoredToken(null);
        setUser(null);
        setProfile(null);
        setProgress(null);
        setSubscriptionDetails(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Direct Supabase signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Fallback to local authentication endpoint
        const res = await apiRequest<{
          token: string;
          user: User;
          profile: UserProfile;
          progress: UserProgress;
        }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        setStoredToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        setProgress(res.progress);
        await fetchSubscription();
        return;
      }

      if (data.session) {
        setStoredToken(data.session.access_token);
      }
      await fetchCurrentUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    displayName: string;
    targetLevel: JLPTLevel;
    nativeLanguage?: string;
  }) => {
    setIsLoading(true);
    try {
      // 1. Direct Supabase signUp
      const { data: supaData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password.trim(),
        options: {
          data: {
            display_name: data.displayName,
            target_level: data.targetLevel,
            native_language: data.nativeLanguage || 'English',
          },
        },
      });

      if (error) {
        // Fallback to API registration
        const res = await apiRequest<{
          token: string;
          user: User;
          profile: UserProfile;
          progress: UserProgress;
        }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        setStoredToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        setProgress(res.progress);
        await fetchSubscription();
        return;
      }

      if (supaData.session) {
        setStoredToken(supaData.session.access_token);
      }
      await fetchCurrentUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
      await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      setProgress(null);
      setSubscriptionDetails(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const res = await apiRequest<{ profile: UserProfile }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    setProfile(res.profile);
    if (updates.targetLevel && progress) {
      setProgress({ ...progress, currentLevel: updates.targetLevel });
    }
  };

  const refreshProgress = async () => {
    if (!user) return;
    try {
      const data = await apiRequest<{ progress: UserProgress; profile: UserProfile }>('/api/progress');
      setProgress(data.progress);
      setProfile(data.profile);
    } catch (err) {
      console.error('Failed to refresh progress:', err);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const activePlanId: PlanId = user?.role === 'admin' ? 'japan_ready' : subscriptionDetails?.plan?.id || 'free';
  const entitlements: EntitlementFeature[] =
    user?.role === 'admin'
      ? [
          'n5',
          'n4',
          'n3',
          'quizzes',
          'ai_coach',
          'business_japanese',
          'jlpt_pro',
          'japan_ready',
          'certificates',
          'priority_ai'
        ]
      : subscriptionDetails?.entitlements || ['n5', 'quizzes', 'ai_coach'];

  const canAccess = (feature: EntitlementFeature, context?: { lessonNumber?: number; level?: string }): boolean => {
    if (user?.role === 'admin') return true;
    if (!entitlements.includes(feature)) return false;

    // Free plan restricts N5 to introductory lessons (1 & 2)
    if (activePlanId === 'free' && feature === 'n5' && context?.lessonNumber && context.lessonNumber > 2) {
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        progress,
        subscriptionDetails,
        activePlanId,
        entitlements,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProgress,
        refreshUser,
        refreshSubscription,
        canAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
