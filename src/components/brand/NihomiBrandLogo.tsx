import React from 'react';

export interface NihomiBrandLogoProps {
  variant?: 'wordmark' | 'emblem' | 'full';
  theme?: 'dark' | 'light' | 'cream' | 'auto';
  size?: number; // Height in pixels (minimum 28px as per guidelines)
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

export const NihomiBrandLogo: React.FC<NihomiBrandLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 32,
  className = '',
  showTagline = true,
  onClick
}) => {
  // Brand Guidelines: Minimum digital display size 28px
  const safeSize = Math.max(28, size);
  const isDark = theme === 'dark' || theme === 'auto';

  // Standalone Mount Fuji Emblem
  if (variant === 'emblem') {
    const markSrc = isDark ? '/brand/nihomi-mark-dark.png' : '/brand/nihomi-mark-light.png';
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ height: safeSize }}
      >
        <img
          src={markSrc}
          alt="Nihomi Mark"
          style={{ height: safeSize, width: 'auto' }}
          className="object-contain max-h-full transition-transform duration-200 hover:scale-105"
          loading="eager"
        />
      </div>
    );
  }

  // Full Wordmark with Mount Fuji Mark (Authentic Founder Master Derivative)
  const logoSrc = isDark ? '/brand/nihomi-logo-dark.png' : '/brand/nihomi-logo-light.png';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ height: safeSize }}
    >
      <img
        src={logoSrc}
        alt="NIHOMI — From Zero Japanese to Japan-Ready"
        style={{ height: safeSize, width: 'auto' }}
        className="object-contain max-h-full transition-opacity duration-200 hover:opacity-95"
        loading="eager"
      />

      {showTagline && (
        <span
          className="hidden xl:inline-block text-[10px] font-medium tracking-wider pl-2 border-l border-white/20 whitespace-nowrap text-stone-400"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          শূন্য থেকে জাপান-রেডি
        </span>
      )}
    </div>
  );
};

export default NihomiBrandLogo;
