// src/components/auth/AuthModal.tsx
// NIHOMI V2 — CRYPTOGRAPHIC AUTHENTICATION MODAL (GOOGLE OAUTH & EMAIL/PASSWORD)
import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Crown,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { trackNihomiEvent } from '../../utils/analytics';
import { getStoredReferralCode, claimReferralReward } from '../../utils/referral';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';

interface AuthModalProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigate }) => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, login, register, user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFounderEmailTyped = email.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com';

  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage(null);
      trackNihomiEvent('signup_started', { method: 'modal_prompt' });
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeAuthModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    trackNihomiEvent('signup_started', { method: 'google' });
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const ok = await loginWithGoogle();
      if (!ok) {
        setErrorMessage('গুগল সাইন-ইন চালু করা সম্ভব হয়নি। অনুগ্রহ করে পপ-আপ অথবা রিডাইরেক্ট পারমিশন চেক করে আবার চেষ্টা করুন।');
      } else {
        trackNihomiEvent('signup_completed', { method: 'google' });
        const ref = getStoredReferralCode();
        if (ref) claimReferralReward(ref).catch(() => {});
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'গুগল সাইন-ইনে ত্রুটি দেখা দিয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।');
      return;
    }

    setIsProcessing(true);
    try {
      if (authMode === 'login') {
        const success = await login(cleanEmail, password);
        if (success) {
          trackNihomiEvent('signup_completed', { method: 'email_login', role: isFounderEmailTyped ? 'founder' : 'student' });
          closeAuthModal();
          if (isFounderEmailTyped) {
            onNavigate?.('founder');
          } else {
            onNavigate?.('dashboard');
          }
        } else {
          setErrorMessage('ইমেইল বা পাসওয়ার্ড সঠিক নয়। পুনরায় যাচাই করে চেষ্টা করুন।');
        }
      } else {
        const success = await register({
          email: cleanEmail,
          password,
          name: name.trim()
        });
        if (success) {
          trackNihomiEvent('signup_completed', { method: 'email_register', role: isFounderEmailTyped ? 'founder' : 'student' });
          const ref = getStoredReferralCode();
          if (ref) claimReferralReward(ref).catch(() => {});
          closeAuthModal();
          if (isFounderEmailTyped) {
            onNavigate?.('founder');
          } else {
            onNavigate?.('dashboard');
          }
        } else {
          setErrorMessage('অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি। এই ইমেইল ইতিমধ্যে নিবন্ধিত থাকতে পারে।');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'সাইন ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#17192A] rounded-3xl shadow-2xl border border-white/10 text-left my-auto text-white"
      >
        <button
          id="btn-auth-modal-close"
          onClick={closeAuthModal}
          className="btn-haptic absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="bg-[#121422] p-6 text-center border-b border-white/10">
          <NihomiBrandLogo variant="full" theme="dark" size={32} showTagline={false} className="mx-auto mb-3 justify-center" />
          <h3 className="text-xl font-bold tracking-tight text-white">
            {authMode === 'login' ? 'সাইন ইন (Sign In)' : 'নতুন অ্যাকাউন্ট তৈরি করুন (Register)'}
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Supabase Cloud Verified OAuth 2.0 & Cryptographic Security
          </p>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Google Auth Button */}
          <button
            id="btn-google-continue"
            type="button"
            onClick={handleGoogleClick}
            disabled={isProcessing}
            className="btn-haptic w-full py-3.5 px-4 bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-3 cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-[#17192A] px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              অথবা ইমেইল দিয়ে প্রবেশ করুন
            </span>
          </div>

          {/* Direct Email / Password Form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  আপনার পূর্ণ নাম
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-input-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: তানভীর কবির"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E45147]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                ইমেইল ঠিকানা (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="auth-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E45147]"
                />
              </div>
            </div>

            {/* Founder Role Indicator Banner */}
            {isFounderEmailTyped && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] flex items-center gap-2 animate-fadeIn">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>ফাউন্ডার অ্যাকাউন্ট শনাক্ত:</strong> লগইনের সাথে সাথে Founder Cockpit ও আনলিমিটেড এক্সেস সক্রিয় হবে।
                </span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="auth-input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E45147]"
                />
              </div>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isProcessing}
              className="btn-haptic w-full py-3 px-4 bg-[#E45147] hover:bg-[#D43E34] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{authMode === 'login' ? 'সাইন ইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch Toggle */}
          <div className="pt-2 text-center text-xs text-stone-400 border-t border-white/10">
            {authMode === 'login' ? (
              <div>
                <span>নতুন শিক্ষার্থী? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  রেজিস্ট্রেশন করুন
                </button>
              </div>
            ) : (
              <div>
                <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  লগইন করুন
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-stone-400 flex items-center justify-center space-x-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Cloud OAuth 2.0 • End-to-End Cryptographic Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
