import crypto from 'crypto';

/**
 * NIHOMI.COM — Production bKash Tokenized Checkout Service (v1.2.0-beta)
 * Official Bangladesh Mobile Financial Services (MFS) Integration
 * 
 * Flow:
 * 1. grantToken()   -> Fetches or returns cached bearer id_token from bKash
 * 2. createPayment() -> Creates checkout session, returns redirect bkashURL
 * 3. executePayment()-> Cryptographically completes payment, asserts transactionStatus === 'Completed'
 * 4. queryPayment()  -> Directly verifies status with bKash API
 */

export interface BKashGrantTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number | string;
  refresh_token?: string;
}

export interface BKashCreatePaymentParams {
  amount: number;
  invoiceNumber: string;
  payerReference: string;
  callbackUrl?: string;
}

export interface BKashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  bkashURL?: string;
  amount?: string;
  currency?: string;
  intent?: string;
  merchantInvoiceNumber?: string;
  createTime?: string;
  orgLogo?: string;
  orgName?: string;
  transactionStatus?: string;
}

export interface BKashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  amount?: string;
  currency?: string;
  intent?: string;
  paymentExecuteTime?: string;
  merchantInvoiceNumber?: string;
  payerType?: string;
  payerReference?: string;
  customerMsisdn?: string;
}

export interface BKashQueryPaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  amount?: string;
  currency?: string;
  intent?: string;
  verificationStatus?: string;
}

export class BKashService {
  private static instance: BKashService;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  public static getInstance(): BKashService {
    if (!BKashService.instance) {
      BKashService.instance = new BKashService();
    }
    return BKashService.instance;
  }

  public get isSandbox(): boolean {
    return process.env.BKASH_SANDBOX !== 'false' && process.env.BKASH_MODE !== 'live';
  }

  public get baseUrl(): string {
    if (process.env.BKASH_BASE_URL) {
      return process.env.BKASH_BASE_URL.replace(/\/+$/, '');
    }
    return this.isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
  }

  public get appKey(): string {
    return process.env.BKASH_APP_KEY || '';
  }

  public get appSecret(): string {
    return process.env.BKASH_APP_SECRET || '';
  }

  public get username(): string {
    return process.env.BKASH_USERNAME || '';
  }

  public get password(): string {
    return process.env.BKASH_PASSWORD || '';
  }

  /**
   * Asserts required credentials are present.
   */
  public ensureConfigured(): void {
    if (!this.appKey || !this.appSecret || !this.username || !this.password) {
      throw new Error(
        'bKash gateway credentials missing. Required: BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD.'
      );
    }
  }

  /**
   * 1. Grant Token: Securely obtains or reuses cached bearer id_token from bKash
   */
  public async grantToken(): Promise<string> {
    this.ensureConfigured();
    const now = Date.now();

    // Reuse cached token if valid for at least 60 more seconds
    if (this.tokenCache && this.tokenCache.expiresAt > now + 60_000) {
      return this.tokenCache.token;
    }

    const endpoint = `${this.baseUrl}/tokenized/checkout/token/grant`;
    console.log(`[bKash PGW] Requesting grant token from ${endpoint}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.username,
        password: this.password,
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`bKash Token Grant HTTP ${res.status}: ${errText || 'Network request failed'}`);
    }

    const data = (await res.json()) as BKashGrantTokenResponse;

    if (data.statusCode && data.statusCode !== '0000') {
      throw new Error(
        `bKash Token Grant rejected [${data.statusCode}]: ${data.statusMessage || 'Authentication Failed'}`
      );
    }

    if (!data.id_token) {
      throw new Error('bKash Token Grant response missing id_token.');
    }

    const expiresInSeconds = Number(data.expires_in) || 3600;
    this.tokenCache = {
      token: data.id_token,
      expiresAt: now + expiresInSeconds * 1000,
    };

    console.log('[bKash PGW] Grant token secured successfully.');
    return data.id_token;
  }

  /**
   * 2. Create Payment: Generates bKash payment URL
   */
  public async createPayment(params: BKashCreatePaymentParams): Promise<BKashCreatePaymentResponse> {
    this.ensureConfigured();
    const token = await this.grantToken();

    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const callbackURL = params.callbackUrl || `${appUrl}/api/payment/callback`;

    const payload = {
      mode: '0011',
      payerReference: params.payerReference,
      callbackURL,
      amount: params.amount.toFixed(2),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: params.invoiceNumber,
    };

    const endpoint = `${this.baseUrl}/tokenized/checkout/create`;
    console.log(`[bKash PGW] Creating checkout session for invoice ${params.invoiceNumber}, amount: ৳${params.amount}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`bKash Create Payment HTTP ${res.status}: ${errText || 'Creation request failed'}`);
    }

    const data = (await res.json()) as BKashCreatePaymentResponse;

    if (data.statusCode && data.statusCode !== '0000') {
      throw new Error(
        `bKash Create Payment failed [${data.statusCode}]: ${data.statusMessage || 'Checkout creation rejected'}`
      );
    }

    if (!data.paymentID || !data.bkashURL) {
      throw new Error('bKash Create Payment response missing paymentID or bkashURL.');
    }

    console.log(`[bKash PGW] Checkout created successfully. paymentID: ${data.paymentID}`);
    return data;
  }

  /**
   * 3. Execute Payment: Finalizes transaction with bKash and validates transactionStatus === 'Completed'
   */
  public async executePayment(paymentID: string): Promise<BKashExecutePaymentResponse> {
    this.ensureConfigured();
    const token = await this.grantToken();

    if (!paymentID || typeof paymentID !== 'string') {
      throw new Error('paymentID is required to execute bKash payment.');
    }

    const endpoint = `${this.baseUrl}/tokenized/checkout/execute`;
    console.log(`[bKash PGW] Executing payment for paymentID: ${paymentID}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({ paymentID }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`bKash Execute Payment HTTP ${res.status}: ${errText || 'Execution request failed'}`);
    }

    const data = (await res.json()) as BKashExecutePaymentResponse;

    if (data.statusCode && data.statusCode !== '0000') {
      throw new Error(
        `bKash Execute Payment failed [${data.statusCode}]: ${data.statusMessage || 'Transaction failed'}`
      );
    }

    // STRICT CHECK: transactionStatus must be 'Completed'
    if (data.transactionStatus !== 'Completed') {
      throw new Error(
        `bKash Transaction incomplete. Status received: '${data.transactionStatus || 'Unknown'}'. Access cannot be granted.`
      );
    }

    if (!data.trxID) {
      throw new Error('bKash Execute Payment response missing official trxID.');
    }

    console.log(`[bKash PGW] Payment executed successfully! trxID: ${data.trxID}, status: ${data.transactionStatus}`);
    return data;
  }

  /**
   * 4. Query Payment: Check transaction status directly with bKash
   */
  public async queryPayment(paymentID: string): Promise<BKashQueryPaymentResponse> {
    this.ensureConfigured();
    const token = await this.grantToken();

    const endpoint = `${this.baseUrl}/tokenized/checkout/payment/status`;
    console.log(`[bKash PGW] Querying payment status for paymentID: ${paymentID}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({ paymentID }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`bKash Query Payment HTTP ${res.status}: ${errText || 'Query request failed'}`);
    }

    const data = (await res.json()) as BKashQueryPaymentResponse;
    return data;
  }
}

export const bKashService = BKashService.getInstance();
