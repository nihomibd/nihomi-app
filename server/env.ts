import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates and retrieves the JWT_SECRET from the environment.
 * Strictly forbids any hardcoded fallback in production or development.
 * Fails fast with a clear security error if JWT_SECRET is missing.
 */
export function getRequiredJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new Error(
      '[CRITICAL SECURITY FATAL ERROR] JWT_SECRET environment variable is not defined or empty. ' +
      'Nihomi.com production security policy strictly forbids hardcoded JWT secret fallbacks. ' +
      'Please configure JWT_SECRET in your environment before starting the application.'
    );
  }
  return secret.trim();
}

/**
 * Helper to ensure critical environment variables are loaded.
 */
export function validateEnvironment(): void {
  // Enforce JWT_SECRET fail-fast check
  getRequiredJwtSecret();
}

export const AUTHORITATIVE_FOUNDER_EMAIL = 'mdtanvirkabirbiplob@gmail.com';

/**
 * Retrieves trusted Admin emails configured in the environment.
 * Authoritative founder: mdtanvirkabirbiplob@gmail.com
 */
export function getAdminEmails(): string[] {
  return [AUTHORITATIVE_FOUNDER_EMAIL];
}

/**
 * Server-authoritative check: verifies if an email belongs to the trusted admin list.
 * Exact admin email: mdtanvirkabirbiplob@gmail.com => ADMIN
 * Every other email => STUDENT
 */
export function isAdminEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === AUTHORITATIVE_FOUNDER_EMAIL;
}

/**
 * Backwards compatibility aliases for existing founder references
 */
export const getFounderEmails = getAdminEmails;
export const isFounderEmail = isAdminEmail;

