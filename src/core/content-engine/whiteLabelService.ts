import { PartnerAcademyTenant, VERIFIED_PARTNER_TENANTS } from './partnerGatewayService';
import { NIHOMI_CORE_DESIGN_SYSTEM, BrandingThemeTokens } from './contentDesignSystem';

export interface ResolvedTenantContext {
  tenant: PartnerAcademyTenant | null;
  branding: BrandingThemeTokens;
  isWhiteLabel: boolean;
}

export class WhiteLabelService {
  /**
   * Resolves the current tenant based on hostname / subdomain.
   * Defaults to NIHOMI Core reference implementation if no subdomain matches.
   */
  static resolveTenantFromHost(hostname: string = 'nihomi.com'): ResolvedTenantContext {
    const cleanHost = hostname.toLowerCase().trim();
    const matched = VERIFIED_PARTNER_TENANTS.find(
      (t) => cleanHost.includes(t.tenantId) || cleanHost.includes(t.subdomain)
    );

    if (matched) {
      return {
        tenant: matched,
        branding: {
          ...NIHOMI_CORE_DESIGN_SYSTEM,
          brandName: matched.institutionName,
          brandNameJa: matched.institutionNameJa || NIHOMI_CORE_DESIGN_SYSTEM.brandNameJa,
          primaryColor: matched.customBranding.primaryColor,
          accentColor: matched.customBranding.accentColor,
          watermarkText: `Powered by NIHOMI™ for ${matched.institutionName}`,
        },
        isWhiteLabel: true,
      };
    }

    return {
      tenant: null,
      branding: NIHOMI_CORE_DESIGN_SYSTEM,
      isWhiteLabel: false,
    };
  }
}
