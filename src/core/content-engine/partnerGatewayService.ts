import { KnowledgeObject } from './types';
import { NihomiStandardService } from './nihomiStandardService';

export interface PartnerAcademyTenant {
  tenantId: string;
  institutionName: string;
  subdomain: string;
  campuses: string[];
  contactEmail: string;
  customBranding: {
    logoUrl?: string;
    primaryColor: string;
    accentColor: string;
    certificateHeader: string;
  };
  totalSeatsPurchased: number;
  allocatedSeatsCount: number;
  status: 'ACTIVE' | 'PILOT' | 'SUSPENDED';
  joinedAt: string;
}

export const VERIFIED_PARTNER_TENANTS: PartnerAcademyTenant[] = [
  {
    tenantId: 'dils-dhaka',
    institutionName: 'Dhaka International Language School (DILS)',
    subdomain: 'dils.nihomi.com',
    campuses: ['Farmgate Main Campus, Dhaka', 'Banani Executive Desk, Dhaka'],
    contactEmail: 'care.dils2014@gmail.com',
    customBranding: {
      primaryColor: '#0c0a09',
      accentColor: '#059669',
      certificateHeader: 'Dhaka International Language School & Nihomi Academic Council',
    },
    totalSeatsPurchased: 200,
    allocatedSeatsCount: 142,
    status: 'ACTIVE',
    joinedAt: '2026-02-01T00:00:00Z',
  },
  {
    tenantId: 'cels-chittagong',
    institutionName: 'Chittagong Elite Language & Skills Academy',
    subdomain: 'cels.nihomi.com',
    campuses: ['GEC Circle, Nasirabad, Chittagong'],
    contactEmail: 'info.cels@gmail.com',
    customBranding: {
      primaryColor: '#0c0a09',
      accentColor: '#2563eb',
      certificateHeader: 'Chittagong Elite Academy & Nihomi Platform',
    },
    totalSeatsPurchased: 100,
    allocatedSeatsCount: 35,
    status: 'ACTIVE',
    joinedAt: '2026-05-15T00:00:00Z',
  },
];

export class PartnerGatewayService {
  static getTenants(): PartnerAcademyTenant[] {
    return VERIFIED_PARTNER_TENANTS;
  }

  static getTenantBySubdomain(subdomain: string): PartnerAcademyTenant | null {
    return (
      VERIFIED_PARTNER_TENANTS.find((t) => t.subdomain === subdomain || t.tenantId === subdomain) ||
      null
    );
  }

  static validatePartnerContent(tenantId: string, obj: KnowledgeObject): { valid: boolean; evaluation: any } {
    obj.tenantId = tenantId;
    const evaluation = NihomiStandardService.evaluateKnowledgeObject(obj);
    return {
      valid: evaluation.passed,
      evaluation,
    };
  }
}
