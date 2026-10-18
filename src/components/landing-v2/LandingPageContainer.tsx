import React from 'react';

interface LandingPageContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const LandingPageContainer: React.FC<LandingPageContainerProps> = ({
  children,
  className = '',
  id
}) => {
  return (
    <div
      id={id}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
};
