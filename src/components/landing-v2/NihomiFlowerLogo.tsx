import React from 'react';

interface NihomiFlowerLogoProps {
  className?: string;
  size?: number;
  theme?: 'dark' | 'light';
}

export const NihomiFlowerLogo: React.FC<NihomiFlowerLogoProps> = ({
  className = '',
  size = 32,
  theme = 'dark'
}) => {
  const markSrc = theme === 'dark' ? '/brand/nihomi-mark-dark.png' : '/brand/nihomi-mark-light.png';
  return (
    <img
      src={markSrc}
      alt="Nihomi Mark"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 ${className}`}
      loading="eager"
    />
  );
};

export default NihomiFlowerLogo;
