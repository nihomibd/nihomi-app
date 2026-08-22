import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { JLPTLevel } from '../types.js';
import { apiRequest, setStoredToken } from '../lib/api.js';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'forgot';
  initialLevel?: JLPTLevel;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', initialLevel = 'N5', onNavigate }) => {
  const { login, register, refreshUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset-confirm'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>(initialLevel);
  const [nativeLanguage, setNativeLanguage] = useState('English');

  // Reset states
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 1-Click Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const mockGoogleProfile = {
        email: email.trim() || 'student.nihomi@gmail.com',
        displayName: displayName.trim() || 'Tanvir Explorer',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        targetLevel
      };

      const res = await apiRequest<{
        token: string;
        user: any;
        profile: any;
        progress: any;
      }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(mockGoogleProfile)
      });

      if (res.token) {
        setStoredToken(res.token);
        await refreshUser();
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In was interrupted. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onNavigate('dashboard');
      } else if (mode === 'register') {
        await register({
          email,
          password,
          displayName: displayName.trim() || email.split('@')[0],
          targetLevel,
          nativeLanguage
        });
        onNavigate('dashboard');
      } else if (mode === 'forgot') {
        const res = await apiRequest<{ success: boolean; message: string; resetToken?: string }>(
          '/api/auth/reset-password-request',
          {
            method: 'POST',
            body: JSON.stringify({ email })
          }
        );
        if (res.resetToken) {
          setResetToken(res.resetToken);
          setMode('reset-confirm');
          setSuccessMsg('Reset code generated. Enter your new password below.');
        } else {
          setSuccessMsg(res.message);
        }
      } else if (mode === 'reset-confirm') {
        await apiRequest('/api/auth/reset-password-confirm', {
          method: 'POST',
          body: JSON.stringify({ resetToken, newPassword })
        });
        setSuccessMsg('Password has been updated! You can now log in.');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="nihomi-auth-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 text-white font-bold font-serif text-2xl mx-auto shadow-sm">
            日
          </div>
          <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            {mode === 'login' && 'Welcome Back to Nihomi'}
            {mode === 'register' && 'Create Your Nihomi Account'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset-confirm' && 'Set New Password'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'login' && 'Log in to continue your Japanese learning journey'}
            {mode === 'register' && 'Start building real Japanese and cultural readiness'}
            {mode === 'forgot' && 'Enter your account email to receive reset instructions'}
            {mode === 'reset-confirm' && 'Choose a secure password for your account'}
          </p>
        </div>

        {/* 1-Click Google Sign In Button */}
        {(mode === 'login' || mode === 'register') && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-3 bg-white cursor-pointer"
              id="btn-google-auth-login"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-stone-400 font-semibold uppercase">Or with Email</span>
            </div>
          </>
        )}

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Name / Display Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="register-display-name"
                  type="text"
                  required
                  placeholder="e.g. Kenji Smith"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Target JLPT Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['N5', 'N4', 'N3'] as JLPTLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        targetLevel === lvl
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      JLPT {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Native Language
                </label>
                <input
                  type="text"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  placeholder="English, Vietnamese, Chinese..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'reset-confirm' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste your reset token"
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
          >
            <span>
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Log In'
                : mode === 'register'
                ? 'Create Account'
                : mode === 'forgot'
                ? 'Send Reset Instructions'
                : 'Update Password'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-2">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-red-600 font-bold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-red-600 font-bold hover:underline"
              >
                Log in here
              </button>
            </p>
          )}

          <div className="pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-[11px] text-stone-400 hover:text-stone-600 font-medium"
            >
              &larr; Back to Nihomi Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
