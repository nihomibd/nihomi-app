import React, { createContext, useContext, useState, useEffect } from 'react';

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: (enable?: boolean) => void;
  zenSoundActive: boolean;
  toggleZenSound: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

const FOCUS_STORAGE_KEY = 'nihomi_focus_mode_active_v1';

export const FocusModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(FOCUS_STORAGE_KEY) === 'true';
  });

  const [zenSoundActive, setZenSoundActive] = useState<boolean>(false);

  const toggleFocusMode = (enable?: boolean) => {
    setIsFocusMode((prev) => {
      const next = enable !== undefined ? enable : !prev;
      try {
        localStorage.setItem(FOCUS_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const toggleZenSound = () => {
    setZenSoundActive((prev) => !prev);
  };

  // Keyboard shortcut: Escape exits Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        toggleFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode,
        toggleFocusMode,
        zenSoundActive,
        toggleZenSound
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = (): FocusModeContextType => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
};
