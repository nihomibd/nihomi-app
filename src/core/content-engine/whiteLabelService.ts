import { PartnerAcademyTenant, VERIFIED_PARTNER_TENANTS } from './partnerGatewayService';
import { NIHOMI_CORE_DESIGN_SYSTEM, BrandingThemeTokens } from './contentDesignSystem';

export class WhiteLabelService {
  static resolveTenantFromHost(hostname: string = 'nihomi.com'): {
    tenant: PartnerAcademyTenant | null;
    branding: BrandingThemeTokens;
    isWhiteLabel: boolean;
  } {
    const matched = VERIFIED_PARTNER_TENANTS.find(
      (t) => hostname.includes(t.tenantId) || hostname.includes(t.subdomain)
    );

    if (matched) {
      return {
        tenant: matched,
        branding: {
          ...NIHOMI_CORE_DESIGN_SYSTEM,
          brandName: matched.institutionName,
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
