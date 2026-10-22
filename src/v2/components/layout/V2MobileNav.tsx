// src/v2/components/layout/V2MobileNav.tsx
import React from 'react';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Store,
  CreditCard
} from 'lucide-react';
import { V2Route } from '../../types';

interface V2MobileNavProps {
  currentRoute: V2Route;
  onNavigate: (route: V2Route) => void;
}

export const V2MobileNav: React.FC<V2MobileNavProps> = ({ currentRoute, onNavigate }) => {
  const tabs: { route: V2Route; label: string; icon: React.FC<{ className?: string }> }[] = [
    { route: 'landing', label: 'হোম', icon: Sparkles },
    { route: 'journey', label: 'জার্নি', icon: Compass },
    { route: 'dashboard', label: 'ড্যাশবোর্ড', icon: GraduationCap },
    { route: 'workos', label: 'WorkOS', icon: Store },
    { route: 'pricing', label: 'প্রাইসিং', icon: CreditCard }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141726]/95 backdrop-blur-md border-t border-[#F6F0E6]/10 px-2 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map(({ route, label, icon: IconComp }) => {
        const isActive = currentRoute === route;
        return (
          <button
            key={route}
            onClick={() => onNavigate(route)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              isActive
                ? 'text-[#E45147] scale-105'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#E45147]/15' : 'bg-transparent'}`}>
              <IconComp className="w-4 h-4" />
            </div>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
