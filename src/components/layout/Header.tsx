import React, { useState } from 'react';
import {
  Menu,
  X,
  User,
  Crown,
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isFounder = (user?.role as string) === 'admin' || (user?.role as string) === 'FOUNDER' || user?.email === 'mdtanvirkabirbiplob@gmail.com';

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'portal', label: 'Dashboard' },
    { id: 'coordination', label: 'Coordination / Docs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80 transition-all text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* BRAND LOGO */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-red-600 transition-colors">
              日
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-950">
                NIHOMI
              </span>
              <span className="text-[11px] font-japanese font-medium text-stone-500 hidden sm:inline">
                日本語
              </span>
            </div>
          </button>

          {/* DESKTOP NAV (MAX 4 CLEAN LINKS) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'portal' && currentView.startsWith('portal'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT USER PROFILE */}
          <div className="hidden md:flex items-center space-x-3">
            {isFounder && (
              <button
                onClick={() => onNavigate('founder')}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Founder Command Center"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Command</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 pr-2 rounded-full bg-white border border-stone-200 shadow-2xs hover:border-stone-300 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-900 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs text-stone-700 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('portal');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>Student Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('credits');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      <span>AI Credits ({user.planId.toUpperCase()})</span>
                    </button>

                    {isFounder && (
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onNavigate('founder');
                        }}
                        className="w-full px-4 py-2 hover:bg-amber-50 text-amber-900 text-left font-bold flex items-center space-x-2 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Founder Command Center</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 hover:bg-red-50 text-red-600 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER (100% RESPONSIVE) */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <button
                onClick={() => onNavigate('portal')}
                className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center"
              >
                {user.name.charAt(0)}
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3 py-1 bg-stone-900 text-white rounded-full text-xs font-bold"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 rounded-xl hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-b border-stone-200 px-4 pt-2 pb-6 space-y-2 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(item.id);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left font-bold ${
                currentView === item.id
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isFounder && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('founder');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-left font-bold text-amber-900 bg-amber-50 border border-amber-200 flex items-center space-x-2"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Founder Command Center</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
