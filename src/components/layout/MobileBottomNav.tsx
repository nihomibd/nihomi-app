import React from 'react';
import {
  Compass,
  BookOpen,
  LayoutDashboard,
  Brain,
  MessageSquare,
  Sparkles,
  Award,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    {
      id: 'landing',
      label: t('nav_home') || 'Home',
      icon: Compass,
      activeViews: ['landing', 'home'],
    },
    {
      id: 'courses',
      label: t('nav_courses') || 'Courses',
      icon: BookOpen,
      activeViews: ['courses', 'lesson'],
    },
    {
      id: 'portal',
      label: t('nav_portal') || 'Portal',
      icon: LayoutDashboard,
      activeViews: ['portal', 'portal-settings', 'portal-subscription'],
    },
    {
      id: 'quizzes',
      label: t('nav_quizzes') || 'Tests',
      icon: Award,
      activeViews: ['quizzes', 'quiz-runner'],
    },
    {
      id: 'coordination',
      label: t('nav_coordination') || 'Visa & Job',
      icon: Briefcase,
      activeViews: ['coordination', 'baito', 'documents', 'passport'],
    },
  ];

  return (
    <nav
      id="nihomi-mobile-bottom-nav"
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0a0a12]/95 sepia:bg-[#fbf0d9]/95 backdrop-blur-md border-t border-slate-200 dark:border-stone-800 sepia:border-[#ebdcc3] px-2 py-1 shadow-lg pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))] transition-colors"
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
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl transition-all active:scale-95 cursor-pointer select-none ${
                isActive
                  ? 'text-red-600 dark:text-rose-400 sepia:text-amber-900 font-bold'
                  : 'text-slate-500 dark:text-stone-400 sepia:text-stone-600 hover:text-slate-900 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-full transition-all ${
                  isActive
                    ? 'bg-red-50 dark:bg-rose-950/60 sepia:bg-[#ebdcc3]'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'portal' && user && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-0.5 max-w-[64px] truncate text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
