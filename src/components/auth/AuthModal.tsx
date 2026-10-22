import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Loader2, AlertTriangle, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { trackNihomiEvent } from '../../utils/analytics';
import { getStoredReferralCode, claimReferralReward } from '../../utils/referral';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';

interface AuthModalProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigate }) => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, setUserData } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleStudentQuick = () => {
    const studentRand = Math.floor(100000 + Math.random() * 900000);
    const studentId = 'NHO-' + studentRand;
    const userId = 'usr_student_' + Math.random().toString(36).substring(2, 9);
    const studentEmail = `student.${studentRand}@nihomi.student`;
    setUserData({
      id: userId,
      email: studentEmail,
      name: `Nihomi Learner #${studentRand.toString().slice(-4)}`,
      role: 'student',
      planId: 'free',
      status: 'ACTIVE',
      studentId,
      nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    trackNihomiEvent('signup_completed', {
      userId,
      method: 'quick_student',
      studentId
    });
    const ref = getStoredReferralCode();
    if (ref) claimReferralReward(ref, userId).catch(() => {});
    closeAuthModal();
    onNavigate?.('dashboard');
  };

  const handleFounderQuick = () => {
    const userId = 'usr_founder_tanvir';
    setUserData({
      id: userId,
      email: 'mdtanvirkabirbiplob@gmail.com',
      name: 'Tanvir Kabir Biplob',
      role: 'founder',
      planId: 'japan_ready',
      status: 'ACTIVE',
      studentId: 'NHO-FOUNDER-01',
      nihomiAccountId: 'ACC-FOUNDER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    trackNihomiEvent('signup_completed', {
      userId,
      method: 'founder_quick',
      studentId: 'NHO-FOUNDER-01'
    });
    closeAuthModal();
    onNavigate?.('founder');
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div id="auth-modal-card" className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#17192A] rounded-3xl shadow-2xl border border-white/10 text-left my-auto text-white">
        <button
          id="btn-auth-modal-close"
          onClick={closeAuthModal}
          className="btn-haptic absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#121422] p-6 text-center border-b border-white/10">
          <NihomiBrandLogo variant="full" theme="dark" size={32} showTagline={false} className="mx-auto mb-3 justify-center" />
          <h3 className="text-xl font-bold tracking-tight text-white">
            সাইন ইন / সাইন আপ (Sign In)
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Supabase Cloud Verified Authentication & Security
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

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-[#17192A] px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              ROLE TESTING / SANDBOX
            </span>
          </div>

          {/* Founder Quick Access Sandbox Action */}
          <button
            type="button"
            id="btn-quick-founder-preview"
            onClick={handleFounderQuick}
            className="btn-haptic w-full py-2.5 px-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500/30 text-amber-300 font-black text-[11px] flex items-center justify-center border border-amber-500/40">
                創
              </div>
              <div className="text-left">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Founder Quick Access</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold uppercase border border-amber-500/30">Founder Role</span>
                </div>
                <div className="text-[10px] text-stone-400 font-medium">mdtanvirkabirbiplob@gmail.com</div>
              </div>
            </div>
            <span className="text-[11px] text-amber-300 font-bold group-hover:underline">Founder →</span>
          </button>

          {/* Frictionless Demo Student Sandbox Action */}
          <button
            type="button"
            id="btn-quick-student-preview"
            onClick={handleStudentQuick}
            className="btn-haptic w-full py-2.5 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[11px] flex items-center justify-center border border-blue-500/30">
                学
              </div>
              <div className="text-left">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Student Quick Sandbox</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-extrabold uppercase border border-blue-500/30">Student Role</span>
                </div>
                <div className="text-[10px] text-stone-400 font-medium">Standard Learner Account • Full Japanese Access</div>
              </div>
            </div>
            <span className="text-[11px] text-stone-300 font-bold group-hover:underline">Student →</span>
          </button>

          <div className="text-center text-[10px] text-stone-400 flex items-center justify-center space-x-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Cloud OAuth 2.0 • End-to-End Cryptographic Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
