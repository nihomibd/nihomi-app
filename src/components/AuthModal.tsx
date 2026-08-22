import React, { useState } from 'react';
import { Phone, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle, X, Sparkles, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMsg('৬ ডিজিটের ওটিপি (OTP) কোডটি সঠিকভাবে পূরণ করুন');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: `usr_${Date.now()}`,
        name: 'Nihomi Student',
        phone: `+880${phoneNumber.replace(/^0/, '')}`,
        role: 'STUDENT',
        targetLevel: 'N5'
      };
      localStorage.setItem('nihomi_user', JSON.stringify(user));
      onSuccess(user);
      onClose();
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: `usr_g_${Date.now()}`,
        name: 'Google User',
        email: 'student@nihomi.com',
        role: 'STUDENT',
        targetLevel: 'N5'
      };
      localStorage.setItem('nihomi_user', JSON.stringify(user));
      onSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Badge */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white mx-auto shadow-lg shadow-red-500/20">
            日
          </div>
          <h3 className="text-2xl font-bold text-white">Nihomi-তে স্বাগতম</h3>
          <p className="text-xs text-slate-400">জাপানি ভাষা শেখার সেরা প্ল্যাটফর্মে লগইন করুন</p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => { setAuthMethod('phone'); setOtpSent(false); setErrorMsg(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'phone' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>মোবাইল ওটিপি (OTP)</span>
          </button>
          <button
            onClick={() => { setAuthMethod('email'); setErrorMsg(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'email' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ইমেইল পাসওয়ার্ড</span>
          </button>
        </div>

        {/* Google 1-Click Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl transition flex items-center justify-center space-x-2 text-sm shadow-md mb-5 cursor-pointer"
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
                    +880 {phoneNumber} নম্বরে ৬ ডিজিটের কোড পাঠানো হয়েছে
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

        {/* Tab: Email / Password */}
        {authMethod === 'email' && (
          <form onSubmit={(e) => { e.preventDefault(); handleGoogleLogin(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ইমেইল এড্রেস</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl transition text-sm shadow-lg shadow-red-600/20 cursor-pointer"
            >
              লগইন করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default AuthModal;
