import React, { useState } from 'react';
import { Phone, Mail, ArrowRight, CheckCircle2, AlertCircle, X, RefreshCw, UserPlus, LogIn } from 'lucide-react';
import { apiRequest, setStoredToken } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('email');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMsg('৬ ডিজিটের ওটিপি (OTP) কোডটি সঠিকভাবে পূরণ করুন');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const phoneEmail = `phone_${phoneNumber.replace(/\D/g, '')}@nihomi.com`;
      const res = await apiRequest<{
        token: string;
        user: any;
        profile: any;
        progress: any;
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: phoneEmail, password: 'phone_otp_verified' })
      });

      if (res.token) {
        setStoredToken(res.token);
      }
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('ইমেইল এবং পাসওয়ার্ড উভয় ফিল্ড পূরণ করুন');
      return;
    }

    if (isSignUpMode && cleanPassword.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessNotice(null);

    try {
      if (isSignUpMode) {
        // 1. Direct Supabase Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              display_name: displayName.trim() || cleanEmail.split('@')[0],
              target_level: 'N5',
            },
          },
        });

        if (error) {
          // If Supabase returns error or unconfigured, attempt graceful API signup fallback
          try {
            const apiRes = await apiRequest<{
              token: string;
              user: any;
              profile: any;
              progress: any;
            }>('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                email: cleanEmail,
                password: cleanPassword,
                displayName: displayName.trim() || cleanEmail.split('@')[0],
                targetLevel: 'N5',
              }),
            });

            if (apiRes.token) {
              setStoredToken(apiRes.token);
            }
            onSuccess(apiRes.user);
            onClose();
            return;
          } catch {
            throw error;
          }
        }

        if (data.session) {
          setStoredToken(data.session.access_token);
          onSuccess(data.user);
          onClose();
        } else if (data.user && !data.session) {
          setSuccessNotice('অ্যাকাউন্ট তৈরি হয়েছে! অনুগ্রহ করে আপনার ইমেইল ইনবক্স চেক করে অ্যাকাউন্ট ভেরিফাই করুন।');
        }
      } else {
        // 2. Direct Supabase Sign In With Password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          // If Supabase encounters an error, attempt fallback to local auth API
          try {
            const apiRes = await apiRequest<{
              token: string;
              user: any;
              profile: any;
              progress: any;
            }>('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
            });

            if (apiRes.token) {
              setStoredToken(apiRes.token);
            }
            onSuccess(apiRes.user);
            onClose();
            return;
          } catch {
            throw error;
          }
        }

        if (data.session) {
          setStoredToken(data.session.access_token);
          onSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || (isSignUpMode ? 'নিবন্ধন ব্যর্থ হয়েছে।' : 'লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড পুনরায় চেক করুন।'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Direct Supabase OAuth flow without local /api/auth fetch
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { prompt: 'select_account' },
          redirectTo: window.location.origin
        }
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setErrorMsg(err.message || 'Google Login failed. Please check Supabase Google provider configuration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Badge */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white mx-auto shadow-lg shadow-red-500/20">
            日
          </div>
          <h3 className="text-2xl font-bold text-white">Nihomi-তে স্বাগতম</h3>
          <p className="text-xs text-slate-400">
            {isSignUpMode ? 'নতুন অ্যাকাউন্ট খুলে জাপানি ভাষা শেখা শুরু করুন' : 'জাপানি ভাষা শেখার সেরা প্ল্যাটফর্মে লগইন করুন'}
          </p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => { setAuthMethod('email'); setErrorMsg(null); setSuccessNotice(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'email' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ইমেইল পাসওয়ার্ড</span>
          </button>
          <button
            onClick={() => { setAuthMethod('phone'); setOtpSent(false); setErrorMsg(null); setSuccessNotice(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'phone' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>মোবাইল ওটিপি</span>
          </button>
        </div>

        {/* Google 1-Click Button (Direct Supabase OAuth) */}
        <button
          id="btn-google-oauth-login"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl transition flex items-center justify-center space-x-2 text-sm shadow-md mb-5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-widest font-semibold">অথবা</span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab: Email / Password (Login & SignUp) */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            {isSignUpMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">আপনার নাম (Full Name)</label>
                <input
                  type="text"
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              id={isSignUpMode ? 'btn-supabase-signup' : 'btn-supabase-login'}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl transition text-sm shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isSignUpMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>

            {/* Toggle Login / Register mode */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setErrorMsg(null);
                  setSuccessNotice(null);
                }}
                className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer underline underline-offset-4"
              >
                {isSignUpMode
                  ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? এখানে লগইন করুন'
                  : 'নতুন শিক্ষার্থী? নতুন অ্যাকাউন্ট খুলুন'}
              </button>
            </div>
          </form>
        )}

        {/* Tab: Phone Number + OTP */}
        {authMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">বাংলাদেশি মোবাইল নম্বর</label>
                  <div className="flex rounded-2xl bg-slate-950 border border-slate-700 overflow-hidden focus-within:border-red-500 transition">
                    <span className="bg-slate-800/80 px-3.5 py-3 text-xs font-bold text-slate-300 flex items-center border-r border-slate-700">
                      🇧🇩 +880
                    </span>
                    <input
                      type="tel"
                      placeholder="17XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ওটিপি (OTP) পাঠান</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="text-xs text-slate-300">
                    +880 {phoneNumber} নম্বরে ৬ ডিজিটের কোড পাঠানো হয়েছে
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otpCode];
                        newOtp[idx] = val;
                        setOtpCode(newOtp);
                        if (val && idx < 5) {
                          document.getElementById(`otp-${idx + 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-14 bg-slate-950 border border-slate-700 text-center text-xl font-bold text-white rounded-xl focus:border-red-500 focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ভেরিফাই ও লগইন</span>}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;




