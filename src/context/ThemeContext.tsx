import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'light' | 'dark' | 'sepia';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nihomi_theme_mode_v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
        if (stored && ['light', 'dark', 'sepia'].includes(stored)) {
          return stored;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (err) {
        console.error('Failed to read theme preference:', err);
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'sepia');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);

      if (theme === 'dark') {
        document.body.style.backgroundColor = '#0a0a12';
        document.body.style.color = '#f1f5f9';
      } else if (theme === 'sepia') {
        document.body.style.backgroundColor = '#fbf0d9';
        document.body.style.color = '#433422';
      } else {
        document.body.style.backgroundColor = '#F8F9FA';
        document.body.style.color = '#1A1A1A';
      }

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (err) {
        console.error('Failed to persist theme:', err);
      }
    }
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'sepia';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
  return context;
}
