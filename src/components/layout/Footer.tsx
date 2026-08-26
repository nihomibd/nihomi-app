import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-stone-200 py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 font-sans antialiased text-left">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Brand Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
            日
          </div>
          <span className="font-bold text-stone-900">NIHOMI™</span>
          <span>•</span>
          <span>Japanese Learning Operating System</span>
        </div>

        {/* Center Quick Links */}
        <div className="flex items-center space-x-6 text-stone-600">
          <a
            href="https://bdtrip24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-950 flex items-center space-x-1 transition-colors"
          >
            <span>bdTrip24 Student Flights</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://shop.nihomi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-950 flex items-center space-x-1 transition-colors"
          >
            <span>Nihomi Store</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right Copyright */}
        <div className="text-stone-400 text-[11px] font-mono">
          © 2026 Nihomi Academic Council. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
