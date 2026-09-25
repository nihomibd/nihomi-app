import React from 'react';

export type NavTab = 'home' | 'learn' | 'practice' | 'ai' | 'profile';

interface MobileBottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs: { id: NavTab; label: string; labelJa: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      labelJa: 'ホーム',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${active ? 'text-rose-600 scale-105' : 'text-stone-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'learn',
      label: 'Learn',
      labelJa: '学ぶ',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${active ? 'text-rose-600 scale-105' : 'text-stone-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'practice',
      label: 'Practice',
      labelJa: '練習',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${active ? 'text-rose-600 scale-105' : 'text-stone-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'ai',
      label: 'AI Sensei',
      labelJa: 'AI',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${active ? 'text-indigo-600 scale-105' : 'text-stone-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      labelJa: 'マイページ',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${active ? 'text-rose-600 scale-105' : 'text-stone-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      id="student-dashboard-mobile-nav"
      aria-label="Student Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-stone-800/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-btn-${t.id}`}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] h-full w-full relative transition-all duration-150 active:scale-[0.92] focus:outline-none cursor-pointer select-none ${
                isActive ? 'text-stone-950 dark:text-white font-bold' : 'text-stone-500 dark:text-stone-400 font-normal hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {isActive && (
                <span 
                  aria-hidden="true" 
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-rose-600 animate-in fade-in duration-200" 
                />
              )}
              <div className="pt-0.5">
                {t.icon(isActive)}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};