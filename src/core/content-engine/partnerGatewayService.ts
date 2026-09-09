import { KnowledgeObject } from './types';
import { NihomiStandardService } from './nihomiStandardService';

export interface PartnerCustomBranding {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  certificateHeader?: string;
  campusFooterText?: string;
}

export interface PartnerAcademyTenant {
  tenantId: string;
  subdomain: string;
  institutionName: string;
  institutionNameJa: string;
  customBranding: PartnerCustomBranding;
  campuses?: string[];
  contactEmail: string;
  verifiedAt: string;
  totalSeatsPurchased?: number;
  allocatedSeatsCount?: number;
  status?: 'ACTIVE' | 'PILOT' | 'SUSPENDED';
}

export const VERIFIED_PARTNER_TENANTS: PartnerAcademyTenant[] = [
  {
    tenantId: 'bdtrip24-academy',
    subdomain: 'academy.bdtrip24.com',
    institutionName: 'bdTrip24 Global Academy',
    institutionNameJa: 'bdTrip24グローバルアカデミー',
    campuses: ['Farmgate Main Campus, Dhaka', 'Banani Executive Desk, Dhaka'],
    customBranding: {
      primaryColor: '#0F172A',
      accentColor: '#2563EB',
      logoUrl: 'https://nihomi.com/assets/partners/bdtrip24-logo.svg',
      certificateHeader: 'bdTrip24 Global Learning Division in Academic Partnership with NIHOMI™',
      campusFooterText: 'bdTrip24 Campus, Dhaka • Academic Council Certified',
    },
    contactEmail: 'support@bdtrip24.com',
    verifiedAt: '2026-08-01T00:00:00Z',
    totalSeatsPurchased: 200,
    allocatedSeatsCount: 142,
    status: 'ACTIVE',
  },
  {
    tenantId: 'cels',
    subdomain: 'cels.nihomi.com',
    institutionName: 'Center for Excellence in Language Studies',
    institutionNameJa: 'エクセレンス語学研究センター',
    campuses: ['GEC Circle, Nasirabad, Chittagong'],
    customBranding: {
      primaryColor: '#18181B',
      accentColor: '#059669',
      logoUrl: 'https://nihomi.com/assets/partners/cels-logo.svg',
      certificateHeader: 'CELS Executive Japanese Academy Powered by NIHOMI™',
      campusFooterText: 'CELS Language Institute • Tokyo-Dhaka Academic Exchange',
    },
    contactEmail: 'info@cels.edu.bd',
    verifiedAt: '2026-08-15T00:00:00Z',
    totalSeatsPurchased: 100,
    allocatedSeatsCount: 35,
    status: 'ACTIVE',
  },
];

export class PartnerGatewayService {
  static getTenants(): PartnerAcademyTenant[] {
    return VERIFIED_PARTNER_TENANTS;
  }

  static getTenantBySubdomain(subdomain: string): PartnerAcademyTenant | null {
    const clean = subdomain.toLowerCase().trim();
    return (
      VERIFIED_PARTNER_TENANTS.find((t) => clean.includes(t.subdomain) || clean.includes(t.tenantId)) ||
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
