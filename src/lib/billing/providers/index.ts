// src/lib/billing/providers/index.ts
// Nihomi (にほみ) — Payment Provider Resolver Factory

import { BkashPaymentProvider } from './bkashProvider';
import { PaymentProvider } from './types';

const providers: Record<string, PaymentProvider> = {
  bkash: new BkashPaymentProvider(),
};

export function getPaymentProvider(providerName: string = 'bkash'): PaymentProvider {
  const provider = providers[providerName.toLowerCase()];
  if (!provider) {
    throw new Error(`Unsupported payment provider: ${providerName}. Supported: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}
