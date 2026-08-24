import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserProfile, UserProgress, JLPTLevel, UserSubscriptionDetails, EntitlementFeature, PlanId, UserRole } from '../types.js';
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
  isLoginModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setIsLoginModalOpen: (open: boolean) => void;
  openLoginModal: (mode?: 'login' | 'register') => void;
  closeLoginModal: () => void;
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openLoginModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const fetchSubscription = useCallback(async () => {
    try {
      const data = await apiRequest<UserSubscriptionDetails>('/api/billing/subscription');
      setSubscriptionDetails(data);
    } catch (err) {
      console.warn('Could not fetch subscription details:', err);
    }
  }, []);

  // Synchronize and construct full user profile from Supabase & metadata
  const syncSupabaseUserProfile = useCallback(async (sessionUser: any) => {
    if (!sessionUser) return;

    let dbProfile: any = null;
    try {
      // 1. Attempt query from Supabase 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (!error && data) {
        dbProfile = data;
      }
    } catch (err) {
      console.warn('Could not query Supabase profiles table, falling back to metadata:', err);
    }

    const meta = sessionUser.user_metadata || {};

    // 2. Extract full name / display name
    const fullName: string =
      dbProfile?.full_name ||
      dbProfile?.displayName ||
      meta.full_name ||
      meta.name ||
      meta.display_name ||
      (sessionUser.email ? sessionUser.email.split('@')[0] : 'Learner');

    // 3. Extract avatar
    const avatarUrl: string =
      dbProfile?.avatar_url ||
      dbProfile?.avatar ||
      meta.avatar_url ||
      meta.picture ||
      meta.avatar ||
      '';

    // 4. Extract or generate Nihomi Account ID (e.g. NHM-880-9972)
    const cleanDigits = sessionUser.id.replace(/[^0-9]/g, '');
    const cleanIdPart = sessionUser.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const generatedId = cleanDigits.length >= 7
      ? `NHM-${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 7)}`
      : `NHM-${cleanIdPart.slice(0, 3)}-${cleanIdPart.slice(3, 7).padEnd(4, '9')}`;
    const nihomiAccountId: string =
      dbProfile?.nihomi_account_id ||
      meta.nihomi_account_id ||
      generatedId;

    // 5. Determine Role
    const userRole: UserRole =
      (dbProfile?.role ||
        meta.role ||
        (sessionUser.email?.includes('admin@nihomi.com') ? 'admin' : 'user')) as UserRole;

    // 6. Target JLPT Level
    const targetLevel: JLPTLevel =
      (dbProfile?.target_level || meta.target_level || 'N5') as JLPTLevel;

    // Construct authenticated User
    const authenticatedUser: User = {
      id: sessionUser.id,
      email: sessionUser.email || dbProfile?.email || 'student@nihomi.com',
      role: userRole,
      name: fullName,
      avatar: avatarUrl,
      nihomiAccountId: nihomiAccountId,
    };

    // Construct populated UserProfile
    const populatedProfile: UserProfile = {
      userId: sessionUser.id,
      displayName: fullName,
      nativeLanguage: dbProfile?.native_language || meta.native_language || 'bn',
      targetLevel: targetLevel,
      dailyGoalMinutes: dbProfile?.daily_goal_minutes || 20,
      bio: dbProfile?.bio || '',
      avatarSeed: dbProfile?.avatar_seed || sessionUser.id,
      avatar: avatarUrl,
      nihomiAccountId: nihomiAccountId,
      createdAt: dbProfile?.created_at || sessionUser.created_at || new Date().toISOString(),
      updatedAt: dbProfile?.updated_at || new Date().toISOString(),
    };

    setUser(authenticatedUser);
    setProfile(populatedProfile);

    // Provide default or existing progress
    setProgress((prev) => prev || {
      userId: sessionUser.id,
      currentLevel: targetLevel,
      completedLessonIds: [],
      totalStudyMinutes: 15,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      experiencePoints: 150,
      updatedAt: new Date().toISOString(),
    });

    // Attempt to merge server-side auth profile & progress if API backend is available
    try {
      const apiData = await apiRequest<{
        user?: User;
        profile?: UserProfile;
        progress?: UserProgress;
      }>('/api/auth/me');

      if (apiData.progress) {
        setProgress(apiData.progress);
      }
      if (apiData.profile) {
        setProfile((prev) => ({
          ...prev,
          ...apiData.profile,
          displayName: fullName,
          avatar: avatarUrl || apiData.profile?.avatar,
          nihomiAccountId: nihomiAccountId,
        }));
      }
    } catch {
      // Local backend optional or offline
    }

    // Fetch subscription details
    await fetchSubscription();
  }, [fetchSubscription]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setStoredToken(data.session.access_token);
        await syncSupabaseUserProfile(data.session.user);
        return;
      }

      const localToken = getStoredToken();
      if (localToken) {
        try {
          const apiRes = await apiRequest<{
            user: User;
            profile: UserProfile;
            progress: UserProgress;
          }>('/api/auth/me');

          const cleanId = apiRes.user.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
          const acctId = apiRes.user.nihomiAccountId || `NHM-${cleanId.padEnd(6, '7')}`;

          setUser({
            ...apiRes.user,
            nihomiAccountId: acctId,
          });
          setProfile({
            ...apiRes.profile,
            nihomiAccountId: acctId,
          });
          setProgress(apiRes.progress);
          await fetchSubscription();
          return;
        } catch {
          // Token expired or invalid
        }
      }

      // No active session
      setUser(null);
      setProfile(null);
      setProgress(null);
      setSubscriptionDetails(null);
    } catch (err) {
      console.warn('Error fetching current user:', err);
      setUser(null);
      setProfile(null);
      setProgress(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncSupabaseUserProfile, fetchSubscription]);

  // Auth State Listener: detect SIGNED_IN, INITIAL_SESSION, TOKEN_REFRESHED, SIGNED_OUT
  useEffect(() => {
    let isMounted = true;

    // 1. Initial auth check
    fetchCurrentUser();

    // 2. Listen to Supabase auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        if (session?.access_token) {
          setStoredToken(session.access_token);
        }
        if (session?.user) {
          // Automatically close Login Modal on login
          setIsLoginModalOpen(false);
          await syncSupabaseUserProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setStoredToken(null);
        setUser(null);
        setProfile(null);
        setProgress(null);
        setSubscriptionDetails(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchCurrentUser, syncSupabaseUserProfile]);

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

        const cleanId = res.user.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
        const acctId = `NHM-${cleanId.padEnd(6, '7')}`;

        setStoredToken(res.token);
        setUser({ ...res.user, nihomiAccountId: acctId });
        setProfile({ ...res.profile, nihomiAccountId: acctId });
        setProgress(res.progress);
        setIsLoginModalOpen(false);
        await fetchSubscription();
        return;
      }

      if (data.session) {
        setStoredToken(data.session.access_token);
        setIsLoginModalOpen(false);
        await syncSupabaseUserProfile(data.session.user);
      }
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
            full_name: data.displayName,
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

        const cleanId = res.user.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
        const acctId = `NHM-${cleanId.padEnd(6, '7')}`;

        setStoredToken(res.token);
        setUser({ ...res.user, nihomiAccountId: acctId });
        setProfile({ ...res.profile, nihomiAccountId: acctId });
        setProgress(res.progress);
        setIsLoginModalOpen(false);
        await fetchSubscription();
        return;
      }

      if (supaData.session) {
        setStoredToken(supaData.session.access_token);
        setIsLoginModalOpen(false);
        await syncSupabaseUserProfile(supaData.session.user);
      }
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
      setIsLoginModalOpen(false);
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
        isLoginModalOpen,
        authModalMode,
        setIsLoginModalOpen,
        openLoginModal,
        closeLoginModal,
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
