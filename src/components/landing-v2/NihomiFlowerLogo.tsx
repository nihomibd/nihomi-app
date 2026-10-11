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
        <radialGradient id="nihomiPetalGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="60%" stopColor="#6D25EA" />
          <stop offset="100%" stopColor="#581C87" />
        </radialGradient>
        <radialGradient id="nihomiCenterCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </radialGradient>
      </defs>

      {/* 5 Plump Rounded Sakura / Plum Petals (Rotated at 72° increments) */}
      <g transform="translate(50, 50)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={angle}
            d="M 0,-8 C -14,-14 -22,-30 -14,-42 C -5,-52 5,-52 14,-42 C 22,-30 14,-14 0,-8 Z"
            fill="url(#nihomiPetalGrad)"
            transform={`rotate(${angle})`}
          />
        ))}

        {/* Delicate Japanese central stamen star & pistil */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <line
            key={`stamen-${angle}`}
            x1="0"
            y1="0"
            x2="0"
            y2="-16"
            stroke="#EDE9FE"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${angle + 36})`}
          />
        ))}
        {[0, 72, 144, 216, 288].map((angle) => (
          <circle
            key={`tip-${angle}`}
            cx="0"
            cy="-18"
            r="2"
            fill="#FFFFFF"
            transform={`rotate(${angle + 36})`}
          />
        ))}

        {/* Center core hub */}
        <circle cx="0" cy="0" r="7.5" fill="url(#nihomiCenterCore)" />
        <circle cx="0" cy="0" r="3" fill="#6D25EA" />
      </g>
    </svg>
  );
};
