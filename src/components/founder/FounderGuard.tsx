import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FounderGuardProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
}

export const FounderGuard: React.FC<FounderGuardProps> = ({ children, onNavigateHome }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div id="founder-guard-loading" className="min-h-[70vh] flex items-center justify-center bg-[#0C0A09] text-stone-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-stone-400">Verifying Founder Privileged Claims...</p>
        </div>
      </div>
    );
  }

  // Strict Founder Verification (Role === 'FOUNDER'/'admin' or Email === Founder Email)
  const isFounder =
    (user?.role as string)?.toUpperCase() === 'FOUNDER' ||
    user?.role === 'admin' ||
    user?.email?.toLowerCase() === 'mdtanvirkabirbiplob@gmail.com' ||
    (user as any)?.isFounder === true;

  if (!user || !isFounder) {
    return (
      <div id="founder-guard-unauthorized" className="min-h-[80vh] flex items-center justify-center p-4 bg-[#0C0A09] text-stone-100">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-950 border border-red-800/80 text-red-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 block">
              RESTRICTED ACCESS
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Nihomi Command Center
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              This terminal is strictly reserved for the Founder &amp; Principal Executive (MD Tanvir Kabir Biplob).
            </p>
          </div>

          <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl text-[11px] font-mono text-stone-400 text-left space-y-1">
            <div>Security Status: <span className="text-red-400 font-bold">UNAUTHORIZED</span></div>
            <div>Current UID: <span className="text-stone-300">{user?.id || 'ANONYMOUS'}</span></div>
            <div>Access Policy: <span className="text-stone-300">DENY_BY_DEFAULT</span></div>
          </div>

          <button
            id="btn-founder-return-public"
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Terminal</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
