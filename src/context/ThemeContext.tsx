import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingThemeTokens, ContentDesignSystem } from '../core/content-engine/contentDesignSystem';
import { WhiteLabelService } from '../core/content-engine/whiteLabelService';
import { PartnerAcademyTenant } from '../core/content-engine/partnerGatewayService';

export type AppTheme = 'light' | 'dark' | 'sepia';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  branding: BrandingThemeTokens;
  tenant: PartnerAcademyTenant | null;
  isWhiteLabel: boolean;
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

      // Dynamic Favicon Update based on resolved branding
      try {
        let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'shortcut icon';
          document.head.appendChild(faviconLink);
        }

        if (resolved.isWhiteLabel && resolved.tenant) {
          // Generate SVG favicon with tenant accent color
          const svgFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="${encodeURIComponent(b.accentColor)}"/><text x="50%" y="58%" font-size="52" font-weight="900" fill="white" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">${resolved.tenant.institutionName.charAt(0)}</text></svg>`;
          faviconLink.href = svgFavicon;
        } else {
          faviconLink.href = '/favicon.svg';
        }
      } catch (err) {
        console.warn('Favicon dynamic update notice:', err);
      }
    }
  }, []);

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
        document.body.style.backgroundColor = resolvedBranding.branding.surfaceBg || '#FAF9F6';
        document.body.style.color = '#1A1A1A';
      }

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (err) {
        console.error('Failed to persist theme:', err);
      }
    }
  }, [theme, resolvedBranding]);

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
    <ThemeContext.Provider
      value={{
        theme,
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
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      branding: ContentDesignSystem.getDesignTokens(),
      tenant: null,
      isWhiteLabel: false
    };
  }
  return context;
}
