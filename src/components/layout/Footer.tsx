import React from 'react';

const NihomiMonogram: React.FC<{ size?: number }> = ({ size = 28 }) => (
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
    <footer className="w-full bg-[#FAF9F6] border-t border-stone-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 font-sans antialiased text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-200/80">
          
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-3">
              <NihomiMonogram size={28} />
              <span className="font-black text-stone-950 text-base tracking-tight">NIHOMI</span>
              <span className="text-stone-300">•</span>
              <span className="font-semibold text-stone-700">nihomi.com</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              AI-Powered Continuous Japanese Learning Companion. Seamless adaptive JLPT N5–N1 mastery ecosystem.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-stone-600 font-medium">
            <button onClick={() => onNavigate?.('courses')} className="hover:text-stone-950 transition-colors cursor-pointer">
              Pathways
            </button>
            <button onClick={() => onNavigate?.('documents')} className="hover:text-stone-950 transition-colors cursor-pointer">
              Resources
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-mono">
          <div>
            © {new Date().getFullYear()} NIHOMI Global. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span>Infinity Learning Loop</span>
            <span>•</span>
            <span>N∞O Monogram DNA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};