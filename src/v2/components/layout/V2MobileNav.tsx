// src/v2/components/layout/V2MobileNav.tsx
import React from 'react';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Store,
  CreditCard,
  User as UserIcon,
  Crown,
  BookOpen
} from 'lucide-react';
import { V2Route } from '../../types';
import { useAuth } from '../../../context/AuthContext';

interface V2MobileNavProps {
  currentRoute: V2Route;
  onNavigate: (route: V2Route) => void;
}

export const V2MobileNav: React.FC<V2MobileNavProps> = ({ currentRoute, onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  const isFounder = Boolean(
    (user?.email?.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com') ||
    user?.role === 'founder'
  );

  return (
    <nav
      id="v2-mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141726]/98 backdrop-blur-lg border-t border-[#F6F0E6]/10 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
    >
      {/* 1. Home / Landing Tab */}
      <button
        onClick={() => onNavigate('landing')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
          currentRoute === 'landing' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentRoute === 'landing' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
          <Sparkles className="w-4 h-4" />
        </div>
        <span>হোম</span>
      </button>

      {/* 2. Journey Tab */}
      <button
        onClick={() => onNavigate('journey')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
          currentRoute === 'journey' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentRoute === 'journey' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
          <Compass className="w-4 h-4" />
        </div>
        <span>জার্নি</span>
      </button>

      {/* 3. Middle Tab: Dashboard if logged in, Curriculum if logged out */}
      {user ? (
        <button
          id="mobile-bottom-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentRoute === 'dashboard' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentRoute === 'dashboard' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover border border-white/20"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : isFounder ? (
              <Crown className="w-4 h-4 text-amber-400" />
            ) : (
              <GraduationCap className="w-4 h-4" />
            )}
          </div>
          <span>ড্যাশবোর্ড</span>
        </button>
      ) : (
        <button
          onClick={() => onNavigate('curriculum')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentRoute === 'curriculum' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentRoute === 'curriculum' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <span>পাঠ্যক্রম</span>
        </button>
      )}

      {/* 4. WorkOS / Baito Tab */}
      <button
        onClick={() => onNavigate('workos')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
          currentRoute === 'workos' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentRoute === 'workos' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
          <Store className="w-4 h-4" />
        </div>
        <span>WorkOS</span>
      </button>

      {/* 5. Pricing Tab */}
      <button
        onClick={() => onNavigate('pricing')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
          currentRoute === 'pricing' ? 'text-[#E45147] scale-105' : 'text-stone-400 hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentRoute === 'pricing' ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
          <CreditCard className="w-4 h-4" />
        </div>
        <span>প্রাইসিং</span>
      </button>
    </nav>
  );
};
