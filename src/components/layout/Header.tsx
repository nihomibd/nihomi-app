import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  Sparkles,
  LogOut,
  Settings,
  CreditCard,
  Crown,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, subscriptionDetails, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'courses', label: 'Programs & JLPT' },
    { id: 'portal', label: 'Student Portal' },
    { id: 'coordination', label: 'Visa & Logistics' },
    { id: 'documents', label: 'Official Documents' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate('landing');
  };

  const getPlanBadgeColor = (planId?: string) => {
    switch (planId) {
      case 'vip':
        return 'bg-amber-500/10 text-amber-600 border-amber-300';
      case 'pro':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'starter':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-sm">
              日
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">NIHOMI</span>
                <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 font-medium rounded border border-red-200">
                  日本語
                </span>
              </div>
              <span className="text-[10px] text-slate-500 tracking-wider font-medium uppercase">
                Japanese Learning & Readiness
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  currentView === item.id || (item.id === 'portal' && currentView.startsWith('portal'))
                    ? 'text-slate-900 border-b-2 border-slate-900 py-1'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs & Profile Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3" ref={dropdownRef}>
                {/* Subscription Badge */}
                <button
                  onClick={() => onNavigate('portal-subscription')}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold rounded-full border transition-all hover:opacity-80 ${getPlanBadgeColor(
                    subscriptionDetails?.planId
                  )}`}
                  title="Click to manage subscription"
                >
                  <Crown className="w-3 h-3 text-red-600" />
                  <span className="uppercase">{subscriptionDetails?.planName?.split(' ')[1] || 'PRO'}</span>
                </button>

                {/* AI Credits Badge */}
                <button
                  onClick={() => onNavigate('credits')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  title="AI Credits - Click to top up"
                >
                  <Sparkles className="w-3 h-3 text-red-500" />
                  <span>{subscriptionDetails?.aiCreditsRemaining ?? 150} Credits</span>
                </button>

                {/* Logged-in User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="inline-flex items-center space-x-2.5 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all text-xs font-semibold text-slate-800 shadow-xs active:scale-[0.98]"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs ring-2 ring-red-500/30">
                      {user.name?.charAt(0) || 'T'}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name?.split(' ')[0] || 'Student'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                            {user.name?.charAt(0) || 'T'}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium truncate">{user.email}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user.id}</div>
                          </div>
                        </div>

                        {/* Subscription Quick Status */}
                        <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Active Plan</span>
                            <span className="font-bold text-slate-900">{subscriptionDetails?.planName || 'Nihomi Pro'}</span>
                          </div>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('portal-subscription');
                            }}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] rounded border border-red-200 transition-colors"
                          >
                            সাবস্ক্রিপশন পরিবর্তন
                          </button>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-1 py-1 text-xs text-slate-700">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('portal');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center space-x-2.5 font-medium transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Student Dashboard (ড্যাশবোর্ড)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('portal-settings');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center space-x-2.5 font-medium transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Customize Profile (প্রোফাইল সেটিংস)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('portal-subscription');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center space-x-2.5 font-medium transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-slate-500" />
                          <span>Subscription & Billing (সাবস্ক্রিপশন)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('credits');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center space-x-2.5 font-medium transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-red-500" />
                          <span>AI Credits & Top-Up Packs</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('coordination');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center space-x-2.5 font-medium transition-colors"
                        >
                          <Compass className="w-4 h-4 text-slate-500" />
                          <span>Japan Visa & Airport Desk</span>
                        </button>
                      </div>

                      {/* Log Out */}
                      <div className="border-t border-slate-100 px-1 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center space-x-2.5 font-semibold text-xs transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span>Log Out (লগ আউট করুন)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={openAuthModal}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
                <button
                  onClick={openAuthModal}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Start Learning</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <button
                onClick={() => onNavigate('portal-settings')}
                className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-red-500/20"
              >
                {user.name?.charAt(0) || 'T'}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${getPlanBadgeColor(subscriptionDetails?.planId)}`}>
                  {subscriptionDetails?.planId || 'PRO'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => {
                    onNavigate('portal-settings');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1 px-2 text-center text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-700"
                >
                  ⚙️ প্রোফাইল সেটিংস
                </button>
                <button
                  onClick={() => {
                    onNavigate('portal-subscription');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1 px-2 text-center text-[10px] font-semibold bg-red-50 border border-red-200 rounded text-red-700"
                >
                  💳 সাবস্ক্রিপশন
                </button>
              </div>
            </div>
          )}

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                currentView === item.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                Log Out (লগ আউট করুন)
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full text-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
              >
                Student Login (Google / Email)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
