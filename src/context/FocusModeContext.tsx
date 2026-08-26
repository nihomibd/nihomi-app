import React, { createContext, useContext, useState, useEffect } from 'react';
import { zenAudioService, ZenSoundscapeType, ZEN_SOUNDSCAPES, ZenSoundscapeInfo } from '../lib/zenAudio';

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: (enable?: boolean) => void;
  zenSoundActive: boolean;
  toggleZenSound: () => void;
  soundscapeMode: ZenSoundscapeType;
  setSoundscapeMode: (mode: ZenSoundscapeType) => void;
  soundscapes: ZenSoundscapeInfo[];
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

const FOCUS_STORAGE_KEY = 'nihomi_focus_mode_active_v1';
const ZEN_SOUND_STORAGE_KEY = 'nihomi_zen_sound_active_v1';
const ZEN_SOUNDSCAPE_STORAGE_KEY = 'nihomi_zen_soundscape_mode_v1';

export const FocusModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(FOCUS_STORAGE_KEY) === 'true';
  });

  const [zenSoundActive, setZenSoundActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ZEN_SOUND_STORAGE_KEY) === 'true';
  });

  const [soundscapeMode, setSoundscapeModeState] = useState<ZenSoundscapeType>(() => {
    if (typeof window === 'undefined') return 'chimes';
    const saved = localStorage.getItem(ZEN_SOUNDSCAPE_STORAGE_KEY) as ZenSoundscapeType;
    return saved || 'chimes';
  });

  const setSoundscapeMode = (mode: ZenSoundscapeType) => {
    setSoundscapeModeState(mode);
    try {
      localStorage.setItem(ZEN_SOUNDSCAPE_STORAGE_KEY, mode);
    } catch {}
    if (zenSoundActive) {
      zenAudioService.setMode(mode);
    }
  };

  const toggleFocusMode = (enable?: boolean) => {
    setIsFocusMode((prev) => {
      const next = enable !== undefined ? enable : !prev;
      try {
        localStorage.setItem(FOCUS_STORAGE_KEY, String(next));
      } catch {}
      if (!next && zenSoundActive) {
        zenAudioService.stop();
        setZenSoundActive(false);
        try {
          localStorage.setItem(ZEN_SOUND_STORAGE_KEY, 'false');
        } catch {}
      }
      return next;
    });
  };

  const toggleZenSound = () => {
    setZenSoundActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ZEN_SOUND_STORAGE_KEY, String(next));
      } catch {}
      if (next) {
        zenAudioService.start(soundscapeMode);
      } else {
        zenAudioService.stop();
      }
      return next;
    });
  };

  // Sync audio state if started
  useEffect(() => {
    if (isFocusMode && zenSoundActive) {
      zenAudioService.start(soundscapeMode);
    } else {
      zenAudioService.stop();
    }
    return () => {
      zenAudioService.stop();
    };
  }, [isFocusMode, zenSoundActive, soundscapeMode]);

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
        toggleZenSound,
        soundscapeMode,
        setSoundscapeMode,
        soundscapes: ZEN_SOUNDSCAPES,
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
