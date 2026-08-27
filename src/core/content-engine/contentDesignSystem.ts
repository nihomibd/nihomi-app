import { JLPTLevel } from '../../types/nihomi';

export interface BrandingThemeTokens {
  brandName: string;
  brandNameJa: string;
  primaryColor: string;
  accentColor: string;
  surfaceBg: string;
  cardBg: string;
  fontSans: string;
  fontJapanese: string;
  fontSerif: string;
  badgeColors: Record<JLPTLevel, { bg: string; text: string; border: string }>;
  watermarkText: string;
  certifiedSealText: string;
}

export const NIHOMI_CORE_DESIGN_SYSTEM: BrandingThemeTokens = {
  brandName: 'NIHOMI™',
  brandNameJa: '日本語学習オペレーティングシステム',
  primaryColor: '#0C0A09',
  accentColor: '#DC2626',
  surfaceBg: '#FAF9F6',
  cardBg: '#FFFFFF',
  fontSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontJapanese: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif',
  fontSerif: '"Hiragino Mincho ProN", "Noto Serif JP", "Yu Mincho", serif',
  badgeColors: {
    N5: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    N4: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    N3: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    N2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    N1: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  },
  watermarkText: 'Verified by NIHOMI STANDARD™ • Academic Council',
  certifiedSealText: '150-Hour Japanese Readiness Standard Certified',
};

export class ContentDesignSystem {
  static getDesignTokens(): BrandingThemeTokens {
    return NIHOMI_CORE_DESIGN_SYSTEM;
  }

  static getBadgeStyle(level: JLPTLevel) {
    return NIHOMI_CORE_DESIGN_SYSTEM.badgeColors[level] || NIHOMI_CORE_DESIGN_SYSTEM.badgeColors.N5;
  }
}
