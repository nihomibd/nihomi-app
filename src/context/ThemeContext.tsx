import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingThemeTokens, ContentDesignSystem } from '../core/content-engine/contentDesignSystem';
import { WhiteLabelService } from '../core/content-engine/whiteLabelService';
import { PartnerAcademyTenant } from '../core/content-engine/partnerGatewayService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AppTheme = 'system' | 'light' | 'dark' | 'sepia';
export type ResolvedTheme = 'light' | 'dark' | 'sepia';

interface ThemeContextType {
  theme: AppTheme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  branding: BrandingThemeTokens;
  tenant: PartnerAcademyTenant | null;
  isWhiteLabel: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nihomi_theme_mode_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
        if (stored && ['system', 'light', 'dark', 'sepia'].includes(stored)) {
          return stored;
        }
        const legacyStored = localStorage.getItem('nihomi_theme_mode_v1') as AppTheme | null;
        if (legacyStored && ['light', 'dark', 'sepia'].includes(legacyStored)) {
          return legacyStored;
        }
      } catch (err) {
        console.error('Failed to read theme preference:', err);
      }
    }
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to OS system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute resolved actual theme
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  const [resolvedBranding, setResolvedBranding] = useState<{
    tenant: PartnerAcademyTenant | null;
    branding: BrandingThemeTokens;
    isWhiteLabel: boolean;
  }>(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'nihomi.com';
    return WhiteLabelService.resolveTenantFromHost(hostname);
  });

  // Inject BrandingThemeTokens as CSS variables into :root and dynamic favicon update
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const hostname = window.location.hostname;
      const resolved = WhiteLabelService.resolveTenantFromHost(hostname);
      setResolvedBranding(resolved);

      const root = document.documentElement;
      const b = resolved.branding;

      // Inject CSS Variables for Dynamic White-Label Branding
      root.style.setProperty('--nihomi-brand-name', `"${b.brandName}"`);
      root.style.setProperty('--nihomi-brand-name-ja', `"${b.brandNameJa}"`);
      root.style.setProperty('--nihomi-primary-color', b.primaryColor);
      root.style.setProperty('--nihomi-accent-color', b.accentColor);
      root.style.setProperty('--nihomi-surface-bg', b.surfaceBg);
      root.style.setProperty('--nihomi-card-bg', b.cardBg);
      root.style.setProperty('--nihomi-font-sans', b.fontSans);
      root.style.setProperty('--nihomi-font-japanese', b.fontJapanese);
      root.style.setProperty('--nihomi-font-serif', b.fontSerif);
      root.style.setProperty('--nihomi-watermark-text', `"${b.watermarkText}"`);
      root.style.setProperty('--nihomi-certified-seal-text', `"${b.certifiedSealText}"`);
    }
  }, []);

  // Apply resolved theme classes to html & body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'sepia');
      root.classList.add(resolvedTheme);
      root.setAttribute('data-theme', resolvedTheme);
      root.setAttribute('data-theme-setting', theme);

      if (resolvedTheme === 'dark') {
        document.body.style.backgroundColor = '#0a0a12';
        document.body.style.color = '#f1f5f9';
      } else if (resolvedTheme === 'sepia') {
        document.body.style.backgroundColor = '#fbf0d9';
        document.body.style.color = '#433422';
      } else {
        document.body.style.backgroundColor = resolvedBranding.branding.surfaceBg || '#FAF9F6';
        document.body.style.color = '#1A1A1A';
      }

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (err) {
        console.error('Failed to persist theme:', err);
      }
    }
  }, [theme, resolvedTheme, resolvedBranding]);

  // Sync theme to Supabase when user is authenticated
  const syncThemeToSupabase = async (newTheme: AppTheme) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user) {
        await supabase
          .from('user_settings')
          .upsert(
            {
              user_id: user.id,
              theme_preference: newTheme,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'user_id' }
          );
      }
    } catch (err) {
      console.warn('Could not sync theme preference to Supabase:', err);
    }
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    syncThemeToSupabase(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      let next: AppTheme = 'light';
      if (prev === 'light') next = 'dark';
      else if (prev === 'dark') next = 'sepia';
      else if (prev === 'sepia') next = 'system';
      else next = 'light';

      syncThemeToSupabase(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        branding: resolvedBranding.branding,
        tenant: resolvedBranding.tenant,
        isWhiteLabel: resolvedBranding.isWhiteLabel
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      branding: ContentDesignSystem.getDesignTokens(),
      tenant: null,
      isWhiteLabel: false
    };
  }
  return context;
}
