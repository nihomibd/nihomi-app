import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, setUserData } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    setIsProcessing(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFounderQuick = () => {
    setUserData({
      id: 'usr_founder_001',
      email: 'mdtanvirkabirbiplob@gmail.com',
      name: 'Tanvir Kabir (Founder)',
      role: 'founder',
      planId: 'japan_ready',
      status: 'ACTIVE',
      studentId: 'NHO-FND-001',
      nihomiAccountId: 'ACC-8888',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-left">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-stone-900 text-white p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white text-stone-900 font-extrabold text-xl flex items-center justify-center shadow-md mb-3">
            日
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Sign In to NIHOMI
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            Supabase Cloud Verified Authentication
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Primary Google Auth Button */}
          <button
            onClick={handleGoogleClick}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-2xl border border-stone-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center space-x-3 active:scale-[0.98] cursor-pointer"
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

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Founder Quick Access
            </span>
          </div>

          <button
            onClick={handleFounderQuick}
            className="w-full py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-900 text-xs font-semibold rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">
                T
              </div>
              <div>
                <div className="font-bold text-stone-900 text-left">Tanvir Kabir Biplob</div>
                <div className="text-[10px] text-stone-500">mdtanvirkabirbiplob@gmail.com</div>
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-bold group-hover:underline">Founder Dashboard →</span>
          </button>

          <div className="text-center text-[10px] text-stone-400 flex items-center justify-center space-x-1 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud OAuth & RLS Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};