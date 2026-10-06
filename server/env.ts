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

/**
 * Retrieves trusted Founder emails configured in the environment.
 */
export function getFounderEmails(): string[] {
  const raw = process.env.FOUNDER_EMAILS || process.env.FOUNDER_EMAIL || 'mdtanvirkabirbiplob@gmail.com';
  return raw
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies if an email belongs to the trusted founder list.
 */
export function isFounderEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return getFounderEmails().includes(email.trim().toLowerCase());
}
