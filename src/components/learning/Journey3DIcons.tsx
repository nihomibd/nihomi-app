import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// ============================================================================
// 1. 3D GLOSSY SPROUT (🌱 replacement)
// ============================================================================
export const IconSprout3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sproutStem" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <linearGradient id="sproutLeafL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="40%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#166534" />
      </linearGradient>
      <linearGradient id="sproutLeafR" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="40%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="sproutGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Soil Mound */}
    <ellipse cx="12" cy="21" rx="6" ry="2" fill="#78350f" opacity="0.6" />
    {/* Stem */}
    <path
      d="M12 21 C12 16, 11 11, 13 8"
      stroke="url(#sproutStem)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Left Leaf */}
    <path
      d="M12.5 12 C9 12, 5 9, 6 5 C9 5, 12 8, 12.5 12 Z"
      fill="url(#sproutLeafL)"
      filter="url(#sproutGlow)"
    />
    {/* Right Leaf */}
    <path
      d="M12.8 9.5 C15.5 8, 19 6.5, 19 3.5 C16 4, 13.5 7, 12.8 9.5 Z"
      fill="url(#sproutLeafR)"
      filter="url(#sproutGlow)"
    />
    {/* Dewdrop highlight */}
    <circle cx="8" cy="7" r="0.8" fill="#ffffff" opacity="0.9" />
  </svg>
);

// ============================================================================
// 2. 3D JAPANESE CALLIGRAPHY BRUSH / FUDE (✍️ replacement)
// ============================================================================
export const IconBrush3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="brushHandle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="50%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="brushGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="brushInk" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="70%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Shaft */}
    <path
      d="M18.5 2.5 L21.5 5.5 L11 16 L8 13 Z"
      fill="url(#brushHandle)"
      stroke="#292524"
      strokeWidth="0.5"
    />
    {/* Gold Ferrule Ring */}
    <path
      d="M11 16 L8 13 L6.5 14.5 L9.5 17.5 Z"
      fill="url(#brushGold)"
    />
    {/* Bristle Tuft with Sumi Ink Tip */}
    <path
      d="M9.5 17.5 L6.5 14.5 C4.5 16.5, 3 19.5, 2.5 21.5 C4.5 21, 7.5 19.5, 9.5 17.5 Z"
      fill="url(#brushInk)"
    />
    {/* Ink Droplet */}
    <circle cx="2.5" cy="21.5" r="1.2" fill="#ef4444" opacity="0.9" />
  </svg>
);

// ============================================================================
// 3. 3D ETHEREAL MORNING SUN (☀️ replacement)
// ============================================================================
export const IconSun3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="sunRadial" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="85%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </radialGradient>
      <radialGradient id="sunGlowCorona" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Outer Radiant Corona */}
    <circle cx="12" cy="12" r="10" fill="url(#sunGlowCorona)" />
    {/* Solar Rays */}
    <g stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
      <line x1="12" y1="1.5" x2="12" y2="3.8" />
      <line x1="12" y1="20.2" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="3.8" y2="12" />
      <line x1="20.2" y1="12" x2="22.5" y2="12" />
      <line x1="4.5" y1="4.5" x2="6.2" y2="6.2" />
      <line x1="17.8" y1="17.8" x2="19.5" y2="19.5" />
      <line x1="4.5" y1="19.5" x2="6.2" y2="17.8" />
      <line x1="17.8" y1="6.2" x2="19.5" y2="4.5" />
    </g>
    {/* 3D Sun Sphere */}
    <circle cx="12" cy="12" r="5.5" fill="url(#sunRadial)" />
    {/* Specular Highlight */}
    <ellipse cx="10" cy="9.5" rx="2" ry="1.2" fill="#ffffff" opacity="0.6" transform="rotate(-30 10 9.5)" />
  </svg>
);

// ============================================================================
// 4. 3D TOKYO KONBINI STOREFRONT (🏪 replacement)
// ============================================================================
export const IconKonbini3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="konbiniRoof" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="konbiniGlass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    {/* Base Building Shadow & Body */}
    <rect x="3" y="6" width="18" height="15" rx="2" fill="#1e1b4b" />
    {/* Tricolor Japanese Awning */}
    <rect x="2" y="5" width="20" height="2" fill="#ff6700" rx="0.5" />
    <rect x="2" y="7" width="20" height="2" fill="#008542" />
    <rect x="2" y="9" width="20" height="2" fill="#ea2825" rx="0.5" />
    {/* Storefront Sign White Plate */}
    <rect x="5" y="2.5" width="14" height="3" rx="1" fill="url(#konbiniRoof)" stroke="#cbd5e1" strokeWidth="0.5" />
    <circle cx="8" cy="4" r="0.8" fill="#ea2825" />
    <circle cx="12" cy="4" r="0.8" fill="#008542" />
    <circle cx="16" cy="4" r="0.8" fill="#ff6700" />
    {/* Glass Windows with Warm Interior Glow */}
    <rect x="4" y="12" width="7" height="8" rx="1" fill="url(#konbiniGlass)" stroke="#38bdf8" strokeWidth="0.6" />
    <rect x="13" y="12" width="7" height="8" rx="1" fill="url(#konbiniGlass)" stroke="#38bdf8" strokeWidth="0.6" />
    {/* Shelf lines in window */}
    <line x1="5" y1="15" x2="10" y2="15" stroke="#fef08a" strokeWidth="0.8" opacity="0.8" />
    <line x1="5" y1="17.5" x2="10" y2="17.5" stroke="#fca5a5" strokeWidth="0.8" opacity="0.8" />
    <line x1="14" y1="15" x2="19" y2="15" stroke="#86efac" strokeWidth="0.8" opacity="0.8" />
  </svg>
);

// ============================================================================
// 5. 3D POLISHED GOLD TROPHY (🏆 replacement)
// ============================================================================
export const IconTrophy3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="goldHandle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="trophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    {/* Handles */}
    <path
      d="M7 6 C3.5 6, 3.5 12, 7 13"
      stroke="url(#goldHandle)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M17 6 C20.5 6, 20.5 12, 17 13"
      stroke="url(#goldHandle)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Cup Body */}
    <path
      d="M7 4 L17 4 L16 11 C15.5 14, 13.5 15.5, 12 15.5 C10.5 15.5, 8.5 14, 8 11 Z"
      fill="url(#goldCup)"
      stroke="#b45309"
      strokeWidth="0.6"
    />
    {/* Stem */}
    <rect x="11" y="15.5" width="2" height="3" fill="url(#goldCup)" />
    {/* Base */}
    <path d="M8 18.5 L16 18.5 L17 21 L7 21 Z" fill="url(#trophyBase)" stroke="#4b5563" strokeWidth="0.6" />
    <rect x="9.5" y="19" width="5" height="1.2" rx="0.4" fill="#fbbf24" />
    {/* Star Engraving */}
    <polygon points="12,6.5 12.8,8.2 14.6,8.3 13.2,9.5 13.7,11.3 12,10.2 10.3,11.3 10.8,9.5 9.4,8.3 11.2,8.2" fill="#ffffff" opacity="0.9" />
    {/* Glint */}
    <circle cx="8.5" cy="5.5" r="0.8" fill="#ffffff" opacity="0.8" />
  </svg>
);

// ============================================================================
// 6. 3D GLOSSY CRIMSON APPLE (🍎 replacement)
// ============================================================================
export const IconApple3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="appleRadial" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="40%" stopColor="#ef4444" />
        <stop offset="75%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
      <linearGradient id="appleLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="60%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Wooden Stem */}
    <path
      d="M12 7 C12 4, 14 3, 15 2"
      stroke="#78350f"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Organic Green Leaf echoing 'あ' loop */}
    <path
      d="M12 4.5 C14.5 3, 18 3.5, 17.5 6 C15.5 6.5, 13 5.5, 12 4.5 Z"
      fill="url(#appleLeaf)"
    />
    {/* Apple Body with bottom cleft */}
    <path
      d="M12 7.5 C10 6, 5 6, 4.5 11 C4 16, 7 21, 11 21 C11.8 21, 12.2 20.3, 12 20.3 C11.8 20.3, 12.2 21, 13 21 C17 21, 20 16, 19.5 11 C19 6, 14 6, 12 7.5 Z"
      fill="url(#appleRadial)"
    />
    {/* Glossy Specular Highlight Crescent */}
    <path
      d="M7 9 C5.5 11, 5.5 15, 7.5 17"
      stroke="#fca5a5"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

// ============================================================================
// 7. 3D TARGET / BULLSEYE (🎯 replacement)
// ============================================================================
export const IconTarget3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="targetRed" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
      <radialGradient id="targetWhite" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </radialGradient>
    </defs>
    {/* Outer Red Ring */}
    <circle cx="12" cy="12" r="10" fill="url(#targetRed)" />
    {/* Middle White Ring */}
    <circle cx="12" cy="12" r="7" fill="url(#targetWhite)" />
    {/* Inner Red Ring */}
    <circle cx="12" cy="12" r="4.2" fill="url(#targetRed)" />
    {/* Bullseye Gold Center */}
    <circle cx="12" cy="12" r="1.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
    {/* Glint Arrow Point */}
    <polygon points="12,10 13.5,13.5 10.5,13.5" fill="#ffffff" opacity="0.8" />
  </svg>
);

// ============================================================================
// 8. 3D LAUNCH ROCKET (🚀 replacement)
// ============================================================================
export const IconRocket3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="rocketFin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id="rocketFire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="70%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Flame Plume */}
    <polygon points="6.5,17.5 4,21.5 8,19.5" fill="url(#rocketFire)" />
    {/* Side Fins */}
    <path d="M8.5 15.5 L4.5 17.5 L6.5 13.5 Z" fill="url(#rocketFin)" />
    <path d="M15.5 8.5 L17.5 4.5 L13.5 6.5 Z" fill="url(#rocketFin)" />
    {/* Rocket Fuselage */}
    <path
      d="M17.5 2.5 C12 3, 8 7, 7 13 L11 17 C17 16, 21 12, 21.5 6.5 Z"
      fill="url(#rocketBody)"
      stroke="#64748b"
      strokeWidth="0.5"
    />
    {/* Nose Cone Tip */}
    <path d="M17.5 2.5 C19 3, 21 5, 21.5 6.5 C20.5 5, 19 3.5, 17.5 2.5 Z" fill="#ef4444" />
    {/* Cyan Porthole Window */}
    <circle cx="14.5" cy="9.5" r="2.2" fill="#0284c7" stroke="#e0f2fe" strokeWidth="0.8" />
  </svg>
);

// ============================================================================
// 9. 3D CELEBRATION BURST (🎉 replacement)
// ============================================================================
export const IconCelebration3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="popperCone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    {/* Party Popper Cone */}
    <polygon points="3,21 6,12 15,18" fill="url(#popperCone)" />
    {/* Stripes on cone */}
    <line x1="4.5" y1="16.5" x2="10.5" y2="19.5" stroke="#fef08a" strokeWidth="1.2" />
    {/* Confetti geometric bursts */}
    <circle cx="16" cy="7" r="1.5" fill="#f59e0b" />
    <circle cx="12" cy="4" r="1.2" fill="#ec4899" />
    <circle cx="20" cy="11" r="1.3" fill="#10b981" />
    <polygon points="18,3 19,5 17,5" fill="#3b82f6" />
    <polygon points="14,11 15.5,13 13.5,13.5" fill="#f43f5e" />
    {/* Floating streamer ribbon */}
    <path d="M12 9 C15 7, 18 10, 21 8" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================================================
// 10. 3D TOKYO ARCHIPELAGO MAP BADGE (🗾 replacement)
// ============================================================================
export const IconTokyoMap3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="japanLand" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Hokkaido */}
    <path d="M16 2.5 C18 2, 20.5 4, 19.5 6 C18 7, 16 5, 16 2.5 Z" fill="url(#japanLand)" opacity="0.85" />
    {/* Honshu Curve */}
    <path d="M17 7 C15 9, 13 11, 10 14 C8 15, 6 17, 4 18 C3.5 17, 5 15, 8 13 C11 10, 14 7, 17 7 Z" fill="url(#japanLand)" />
    {/* Kyushu & Shikoku */}
    <circle cx="5" cy="19.5" r="1.4" fill="url(#japanLand)" />
    <circle cx="8" cy="16.5" r="1.1" fill="url(#japanLand)" />
    {/* Tokyo Ruby Signal Beacon */}
    <circle cx="13" cy="11.5" r="2.2" fill="#ef4444" className="animate-pulse" />
    <circle cx="13" cy="11.5" r="1" fill="#ffffff" />
  </svg>
);

// ============================================================================
// 11. 3D FROSTED LIGHTBULB (💡 replacement)
// ============================================================================
export const IconLightbulb3D: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="bulbGlow" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
    </defs>
    {/* Bulb Glass */}
    <path
      d="M12 3 C8 3, 5.5 5.5, 5.5 9 C5.5 11.5, 7.5 13.5, 8.5 16 L15.5 16 C16.5 13.5, 18.5 11.5, 18.5 9 C18.5 5.5, 16 3, 12 3 Z"
      fill="url(#bulbGlow)"
    />
    {/* Filament Glow */}
    <path d="M10 10 L12 7 L14 10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    {/* Screw Base */}
    <rect x="9" y="16.5" width="6" height="1.8" rx="0.5" fill="#94a3b8" />
    <rect x="9.5" y="18.5" width="5" height="1.5" rx="0.5" fill="#64748b" />
    <ellipse cx="12" cy="20.5" rx="1.5" ry="0.8" fill="#475569" />
  </svg>
);
