import React, { useState, useEffect } from 'react';
import {
  Home,
  Compass,
  BookOpen,
  LayoutDashboard,
  Crown,
  TrendingUp,
  GraduationCap,
  Sparkles,
  PenTool,
  LogIn
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const [isAiSenseiActive, setIsAiSenseiActive] = useState(false);

  const isFounder = user?.role === 'admin' || user?.role === 'founder';

  useEffect(() => {
    const handleAiToggle = (e: any) => {
      setIsAiSenseiActive(Boolean(e.detail?.isOpen ?? e.detail?.open));
    };
    const handleModalToggle = (e: any) => {
      setIsAiSenseiActive(Boolean(e.detail?.isOpen ?? e.detail?.open));
    };

    window.addEventListener('nihomi:ai-sensei-toggle', handleAiToggle);
    window.addEventListener('nihomi:modal-toggle', handleModalToggle);

    return () => {
      window.removeEventListener('nihomi:ai-sensei-toggle', handleAiToggle);
      window.removeEventListener('nihomi:modal-toggle', handleModalToggle);
    };
  }, []);

  if (isAiSenseiActive) {
    return null;
  }

  // Role-specific bottom navigation items
  let navItems: Array<{
    id: string;
    label: string;
    icon: any;
    activeViews: string[];
    action?: () => void;
  }> = [];

  if (isFounder) {
    navItems = [
      {
        id: 'landing',
        label: 'Home',
        icon: Home,
        activeViews: ['landing'],
      },
      {
        id: 'founder',
        label: 'Command',
        icon: Crown,
        activeViews: ['founder', 'admin', 'command-center'],
      },
      {
        id: 'growth',
        label: 'Growth',
        icon: TrendingUp,
        activeViews: ['growth', 'admin-growth'],
      },
      {
        id: 'content-studio',
        label: 'Studio',
        icon: GraduationCap,
        activeViews: ['content-studio'],
      },
      {
        id: 'dashboard',
        label: 'Learner',
        icon: LayoutDashboard,
        activeViews: ['dashboard', 'student-dashboard'],
      },
    ];
  } else if (user) {
    navItems = [
      {
        id: 'dashboard',
        label: 'ড্যাশবোর্ড',
        icon: LayoutDashboard,
        activeViews: ['dashboard', 'student-dashboard', 'portal'],
      },
      {
        id: 'journey',
        label: 'জার্নি',
        icon: Compass,
        activeViews: ['journey', 'mission'],
      },
      {
        id: 'courses',
        label: 'পাঠ্যক্রম',
        icon: BookOpen,
        activeViews: ['courses', 'curriculum', 'lesson', 'pathways'],
      },
      {
        id: 'practice',
        label: 'প্র্যাকটিস',
        icon: PenTool,
        activeViews: ['practice', 'lesson-practice', 'quizzes'],
      },
      {
        id: 'landing',
        label: 'হোম',
        icon: Home,
        activeViews: ['landing'],
      },
    ];
  } else {
    navItems = [
      {
        id: 'landing',
        label: 'হোম',
        icon: Home,
        activeViews: ['landing'],
      },
      {
        id: 'courses',
        label: 'কোর্স',
        icon: BookOpen,
        activeViews: ['courses', 'curriculum'],
      },
      {
        id: 'world',
        label: '3D ওয়ার্ল্ড',
        icon: Compass,
        activeViews: ['world', 'canvas', 'shibuya'],
      },
      {
        id: 'pricing',
        label: 'প্রাইসিং',
        icon: Sparkles,
        activeViews: ['pricing', 'plans'],
      },
      {
        id: 'login',
        label: 'লগইন',
        icon: LogIn,
        activeViews: ['login', 'auth'],
        action: () => openAuthModal('login'),
      },
    ];
  }

  return (
    <nav
      id="nihomi-mobile-bottom-nav"
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/90 dark:bg-[#141726]/90 backdrop-blur-xl border-t border-stone-200/80 dark:border-stone-800/80 px-2 py-1.5 shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] transition-colors"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activeViews.includes(currentView);

          return (
            <button
              key={item.id}
              id={`mobile-bottom-nav-${item.id}`}
              type="button"
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-2xl transition-all active:scale-95 cursor-pointer select-none ${
                isActive
                  ? 'text-stone-950 dark:text-white font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-stone-900" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-1 max-w-[64px] truncate text-center font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
