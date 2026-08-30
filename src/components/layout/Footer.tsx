import React from 'react';

const NihomiMonogram: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0"
  >
    <path d="M20 82V28C20 23.5817 23.5817 20 28 20H32C36.4183 20 40 23.5817 40 28V82H20Z" fill="#0F172A" />
    <path d="M32 24L72 76C75 80 80 80 84 76C88 72 88 66 84 62L62 38C58 34 52 34 48 38L32 54" stroke="#4F46E5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M68 82V38C68 33.5817 71.5817 30 76 30H80C84.4183 30 88 33.5817 88 38V82H68Z" fill="#0F172A" />
    <circle cx="50" cy="50" r="10" stroke="#4F46E5" strokeWidth="6" strokeDasharray="4 2" />
    <circle cx="78" cy="22" r="8" fill="#E11D48" />
  </svg>
);

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-stone-200/80 py-12 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Centered Brand Identity */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="flex items-center space-x-3">
            <NihomiMonogram size={26} />
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-stone-950 text-base tracking-tight">NIHOMI</span>
              <span className="text-[11px] font-japanese font-medium text-stone-500">日本語</span>
            </div>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-600 font-medium">Continuous Learning OS</span>
          </div>

          {/* Quick Clean Navigation Links */}
          <div className="flex items-center space-x-6 text-xs font-semibold text-stone-600">
            <button
              onClick={() => onNavigate?.('courses')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Pathways
            </button>
            <button
              onClick={() => onNavigate?.('portal')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate?.('documents')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Resources
            </button>
          </div>
        </div>

        {/* Bottom Legal & Philosophy Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} NIHOMI.COM. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Adaptive JLPT Intelligence</span>
            <span>•</span>
            <span>N∞O Learning DNA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};