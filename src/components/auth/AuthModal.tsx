import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setUserData } = useAuth();
  const [emailInput, setEmailInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (email: string, name: string, role: 'student' | 'founder') => {
    setUserData({
      id: 'usr_' + Date.now(),
      email,
      name,
      role,
      planId: role === 'founder' ? 'japan_ready' : 'starter',
      status: 'ACTIVE',
      studentId: 'NHO-' + Math.floor(100000 + Math.random() * 900000),
      nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
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
            Adaptive Japanese Learning Ecosystem
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">Enter Email Address</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-900 text-xs font-medium"
            />
          </div>

          <button
            onClick={() => handleLogin(emailInput || 'student@nihomi.com', emailInput ? emailInput.split('@')[0] : 'Learner', 'student')}
            className="w-full py-3 px-4 bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Continue as Student</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Founder Access
            </span>
          </div>

          <button
            onClick={() => handleLogin('mdtanvirkabirbiplob@gmail.com', 'Tanvir Kabir (Founder)', 'founder')}
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
            <span>256-bit Encrypted Session Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};