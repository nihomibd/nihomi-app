import React from 'react';

export interface TenantConfig {
  tenantId: string;
  academyName: string;
  academyNameJa: string;
  domain: string;
  contactEmail: string;
  mushakBinNumber: string;
  customBranding: {
    primaryColorHex: string;
    logoUrl: string;
    watermarkText: string;
  };
  allowedJLPTLevels: ('N5' | 'N4' | 'N3' | 'N2' | 'N1')[];
  status: 'ACTIVE' | 'PILOT' | 'SUSPENDED';
}

export class TenantService {
  private static tenants: TenantConfig[] = [
    {
      tenantId: 'tenant-nihomi-core',
      academyName: 'Nihomi Academic Council (Reference Platform)',
      academyNameJa: 'ニホミ日本語アカデミック評議会',
      domain: 'nihomi.com',
      contactEmail: 'mdtanvirkabirbiplob@gmail.com',
      mushakBinNumber: '001928374-0101',
      customBranding: {
        primaryColorHex: '#DC2626',
        logoUrl: 'https://nihomi.com/assets/icon-512.png',
        watermarkText: 'NIHOMI STANDARD™ CERTIFIED',
      },
      allowedJLPTLevels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      status: 'ACTIVE',
    },
    {
      tenantId: 'tenant-dils-dhaka',
      academyName: 'Dhaka International Language School (DILS)',
      academyNameJa: 'ダッカ国際言語学校',
      domain: 'dils.nihomi.com',
      contactEmail: 'care.dils2014@gmail.com',
      mushakBinNumber: '003892183-0101',
      customBranding: {
        primaryColorHex: '#059669',
        logoUrl: 'https://nihomi.com/assets/dils-logo.png',
        watermarkText: 'DILS ACADEMY & NIHOMI STANDARD™',
      },
      allowedJLPTLevels: ['N5', 'N4', 'N3'],
      status: 'ACTIVE',
    },
    {
      tenantId: 'tenant-cels-chittagong',
      academyName: 'Chittagong Elite Language & Skills Academy',
      academyNameJa: 'チッタゴン・エリート語学アカデミー',
      domain: 'cels.nihomi.com',
      contactEmail: 'info@cels-bd.com',
      mushakBinNumber: '004128914-0101',
      customBranding: {
        primaryColorHex: '#2563EB',
        logoUrl: 'https://nihomi.com/assets/cels-logo.png',
        watermarkText: 'CELS ACADEMY • NIHOMI PARTNER',
      },
      allowedJLPTLevels: ['N5', 'N4'],
      status: 'ACTIVE',
    },
  ];

  private static activeTenantId: string = 'tenant-nihomi-core';
  private static listeners: Set<(tenant: TenantConfig) => void> = new Set();

  static getTenants(): TenantConfig[] {
    return this.tenants;
  }

  static getActiveTenant(): TenantConfig {
    return this.tenants.find((t) => t.tenantId === this.activeTenantId) || this.tenants[0];
  }

  static setActiveTenant(tenantId: string): TenantConfig {
    const found = this.tenants.find((t) => t.tenantId === tenantId);
    if (found) {
      this.activeTenantId = tenantId;
      this.notifyListeners(found);
      return found;
    }
    const fallback = this.getActiveTenant();
    this.notifyListeners(fallback);
    return fallback;
  }

  static subscribe(listener: (tenant: TenantConfig) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(tenant: TenantConfig) {
    this.listeners.forEach((listener) => {
      try {
        listener(tenant);
      } catch (err) {
        console.error('Tenant subscriber error:', err);
      }
    });
  }

  static getTenantById(tenantId: string): TenantConfig | undefined {
    return this.tenants.find((t) => t.tenantId === tenantId);
  }
}

export function useActiveTenant(): TenantConfig {
  const [tenant, setTenant] = React.useState<TenantConfig>(() => TenantService.getActiveTenant());

  React.useEffect(() => {
    return TenantService.subscribe((updated) => {
      setTenant(updated);
    });
  }, []);

  return tenant;
}

