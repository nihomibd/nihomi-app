import React from 'react';

interface NihomiFlowerLogoProps {
  className?: string;
  size?: number;
}

export const NihomiFlowerLogo: React.FC<NihomiFlowerLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Nihomi Flower Logo"
    >
      <defs>
        <radialGradient id="nihomiPetal1" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        <radialGradient id="nihomiPetal2" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6D25EA" />
        </radialGradient>
        <radialGradient id="nihomiCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#A855F7" />
        </radialGradient>
      </defs>

      {/* 8-Petal Japanese Sakura Flower Emblem */}
      <g transform="translate(50, 50)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <path
            key={angle}
            d="M 0,-4 C -8,-16 -13,-32 0,-44 C 13,-32 8,-16 0,-4 Z"
            fill={idx % 2 === 0 ? 'url(#nihomiPetal1)' : 'url(#nihomiPetal2)'}
            opacity="0.92"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Subtle inner petal layer */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <path
            key={`inner-${angle}`}
            d="M 0,-2 C -4,-10 -7,-20 0,-28 C 7,-20 4,-10 0,-2 Z"
            fill="#E9D5FF"
            opacity="0.55"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Center core */}
        <circle cx="0" cy="0" r="9" fill="url(#nihomiCenter)" />
        <circle cx="0" cy="0" r="4.5" fill="#581C87" />
      </g>
    </svg>
  );
};
