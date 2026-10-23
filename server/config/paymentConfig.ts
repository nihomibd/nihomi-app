/**
 * NIHOMI PAYMENT GATEWAY RUNTIME CONFIGURATION
 * Validated loaders for bKash Merchant Gateway and SSLCommerz
 */

export interface BKashConfig {
  mode: 'test' | 'live';
  isSandbox: boolean;
  baseUrl: string;
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  webhookSecret: string;
  isConfigured: boolean;
}

export interface SSLCommerzConfig {
  mode: 'test' | 'live';
  isSandbox: boolean;
  baseUrl: string;
  storeId: string;
  storePassword: string;
  isConfigured: boolean;
}

export interface PaymentEnvironmentSummary {
  bkash: {
    mode: 'test' | 'live';
    isConfigured: boolean;
    appKeyPrefix: string;
    usernamePrefix: string;
    baseUrl: string;
  };
  sslcommerz: {
    mode: 'test' | 'live';
    isConfigured: boolean;
    storeIdPrefix: string;
    baseUrl: string;
  };
  currency: 'BDT';
  vatRatePercent: number;
}

export const getBKashConfig = (): BKashConfig => {
  const mode = (process.env.BKASH_MODE === 'live' || process.env.BKASH_SANDBOX === 'false') ? 'live' : 'test';
  const isSandbox = mode !== 'live';
  const defaultBaseUrl = isSandbox
    ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
    : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
  const baseUrl = process.env.BKASH_BASE_URL?.replace(/\/+$/, '') || defaultBaseUrl;

  const appKey = process.env.BKASH_APP_KEY || '';
  const appSecret = process.env.BKASH_APP_SECRET || '';
  const username = process.env.BKASH_USERNAME || '';
  const password = process.env.BKASH_PASSWORD || '';
  const webhookSecret = process.env.BKASH_WEBHOOK_SECRET || appSecret;

  const isConfigured = Boolean(
    appKey &&
    appSecret &&
    username &&
    password &&
    !appKey.includes('test_placeholder')
  );

  return {
    mode,
    isSandbox,
    baseUrl,
    appKey,
    appSecret,
    username,
    password,
    webhookSecret,
    isConfigured
  };
};

export const getSSLCommerzConfig = (): SSLCommerzConfig => {
  const mode = (process.env.SSLCOMMERZ_MODE === 'live' || process.env.SSLCOMMERZ_IS_SANDBOX === 'false') ? 'live' : 'test';
  const isSandbox = mode !== 'live';
  const baseUrl = isSandbox
    ? 'https://sandbox.sslcommerz.com'
    : 'https://securepay.sslcommerz.com';

  const storeId = process.env.SSLCOMMERZ_STORE_ID || process.env.STORE_ID || '';
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || process.env.STORE_PASSWORD || '';

  const isConfigured = Boolean(
    storeId &&
    storePassword &&
    !storeId.includes('test_placeholder')
  );

  return {
    mode,
    isSandbox,
    baseUrl,
    storeId,
    storePassword,
    isConfigured
  };
};

export const getPaymentEnvironmentSummary = (): PaymentEnvironmentSummary => {
  const bkash = getBKashConfig();
  const ssl = getSSLCommerzConfig();

  return {
    bkash: {
      mode: bkash.mode,
      isConfigured: bkash.isConfigured,
      appKeyPrefix: bkash.appKey ? `${bkash.appKey.slice(0, 4)}...` : 'not_set',
      usernamePrefix: bkash.username ? `${bkash.username.slice(0, 3)}...` : 'not_set',
      baseUrl: bkash.baseUrl
    },
    sslcommerz: {
      mode: ssl.mode,
      isConfigured: ssl.isConfigured,
      storeIdPrefix: ssl.storeId ? `${ssl.storeId.slice(0, 4)}...` : 'not_set',
      baseUrl: ssl.baseUrl
    },
    currency: 'BDT',
    vatRatePercent: 5.0
  };
};
