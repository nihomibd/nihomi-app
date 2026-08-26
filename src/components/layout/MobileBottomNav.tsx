import React from 'react';
import {
  Compass,
  BookOpen,
  LayoutDashboard,
  Award,
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
      label: t('nav_portal') || 'Dashboard',
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
      label: t('nav_coordination') || 'Coordination',
      icon: Briefcase,
      activeViews: ['coordination', 'baito', 'documents', 'passport'],
    },
  ];

  return (
    <nav
      id="nihomi-mobile-bottom-nav"
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/90 dark:bg-[#0a0a12]/90 backdrop-blur-xl border-t border-stone-200/80 dark:border-stone-800/80 px-2 py-1.5 shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] transition-colors"
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
                {item.id === 'portal' && user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-stone-900" />
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
