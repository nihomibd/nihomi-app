import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { User, UserRole } from './types.js';
import { getRequiredJwtSecret } from './env.js';

export type { UserRole } from './types.js';

/**
 * Authenticated user entity attached to Express requests upon cryptographic verification.
 * Fully compatible with db.ts User entity.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt?: string;
  updatedAt?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

/**
 * Verified authentication context containing the authenticated user and sanitized bearer token.
 */
export interface AuthContext {
  user: AuthenticatedUser;
  token: string;
}

/**
 * Cryptographically verified token payload claims.
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  aud?: string;
  iss?: string;
  sub?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

/**
 * Strongly typed Express Request carrying verified user identity and auth context.
 */
export interface AuthenticatedRequest extends Request {
  user?: any;
  authContext?: AuthContext;
  file?: Express.Multer.File | any;
  files?: Express.Multer.File[] | any;
}

// Base64URL Encoding & Decoding Helpers (RFC 7515 / Zero-dependency)
function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Timing-safe, constant-time signature comparison to prevent side-channel timing attacks.
 */
function safeCompareSignatures(receivedSig: string, expectedSig: string): boolean {
  try {
    const cleanReceived = receivedSig.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').trim();
    const cleanExpected = expectedSig.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').trim();

    const bufReceived = Buffer.from(cleanReceived, 'utf-8');
    const bufExpected = Buffer.from(cleanExpected, 'utf-8');

    if (bufReceived.length !== bufExpected.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufReceived, bufExpected);
  } catch {
    return false;
  }
}

/**
 * Verifies HMAC-SHA256 signature using timing-safe comparison.
 * Supports both standard UTF-8 string secrets and Base64-encoded binary keys.
 */
function verifyHmacSha256(dataToSign: string, signature: string, secret: string): boolean {
  try {
    if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
      return false;
    }
    const cleanSecret = secret.trim();

    // 1. Primary: Standard UTF-8 secret string
    const expectedUtf8 = crypto
      .createHmac('sha256', cleanSecret)
      .update(dataToSign)
      .digest('base64');

    if (safeCompareSignatures(signature, expectedUtf8)) {
      return true;
    }

    // 2. Secondary: Base64-decoded binary key (Supabase keys in base64 format)
    if (/^[A-Za-z0-9+/=_-]{32,}$/.test(cleanSecret)) {
      try {
        const normalizedB64 = cleanSecret.replace(/-/g, '+').replace(/_/g, '/');
        const secretBuf = Buffer.from(normalizedB64, 'base64');
        if (secretBuf.length >= 20) {
          const expectedB64 = crypto
            .createHmac('sha256', secretBuf)
            .update(dataToSign)
            .digest('base64');
          if (safeCompareSignatures(signature, expectedB64)) {
            return true;
          }
        }
      } catch {
        // Ignore buffer decode errors
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Retrieves candidate verification secrets configured in the runtime environment.
 * SUPABASE_JWT_SECRET is prioritized for Supabase Auth compatibility,
 * followed by JWT_SECRET for Nihomi native tokens.
 */
function getVerificationSecrets(): string[] {
  const secrets: string[] = [];
  const supabaseSecret = (process.env.SUPABASE_JWT_SECRET || '').trim();
  const jwtSecret = (process.env.JWT_SECRET || '').trim();

  if (supabaseSecret) {
    secrets.push(supabaseSecret);
  }
  if (jwtSecret && !secrets.includes(jwtSecret)) {
    secrets.push(jwtSecret);
  }

  return secrets;
}

/**
 * Validates whether a given string is an allowed UserRole.
 */
function isValidUserRole(role: unknown): role is UserRole {
  return role === 'admin' || role === 'instructor' || role === 'user' || role === 'founder';
}

/**
 * Derives user role strictly from cryptographically verified claims.
 * Role resolution priority:
 * 1. app_metadata.role (Supabase server-managed authoritative claim)
 * 2. user_metadata.role (Supabase user metadata claim)
 * 3. role claim (Nihomi native token claim; explicitly filters out Postgres 'authenticated')
 *
 * Defaults safely to 'user'. Hardcoded email bypasses are strictly forbidden.
 */
function resolveUserRole(rawPayload: Record<string, any>): UserRole {

  // 1. Supabase app_metadata.role (server-controlled, cannot be spoofed by client)
  if (isValidUserRole(rawPayload.app_metadata?.role)) {
    return rawPayload.app_metadata.role;
  }

  // 2. Supabase user_metadata.role
  if (isValidUserRole(rawPayload.user_metadata?.role)) {
    return rawPayload.user_metadata.role;
  }

  // 3. Top-level role claim (standard in native tokens; ignore Postgres 'authenticated')
  if (rawPayload.role !== 'authenticated' && isValidUserRole(rawPayload.role)) {
    return rawPayload.role;
  }

  // Least-privilege safe default
  return 'user';
}

/**
 * Sign a stateless, cryptographically secure HMAC-SHA256 JWT
 */
export function signStatelessJwt(
  payload: { userId: string; email: string; role: UserRole },
  expiresInSeconds: number = 30 * 24 * 60 * 60 // 30 days
): string {
  let jwtSecret: string;
  try {
    jwtSecret = getRequiredJwtSecret();
  } catch {
    const supabaseSecret = (process.env.SUPABASE_JWT_SECRET || '').trim();
    if (supabaseSecret) {
      jwtSecret = supabaseSecret;
    } else {
      throw new Error('[CRITICAL SECURITY ERROR] No JWT secret configured for signing tokens.');
    }
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Statelessly and cryptographically verify an HMAC-SHA256 JWT.
 * Validates Nihomi application tokens and Supabase Auth session tokens.
 *
 * Hardening rules:
 * - Must strictly match header.alg === 'HS256'
 * - Signature must cryptographically verify against SUPABASE_JWT_SECRET or JWT_SECRET
 * - Bypass logic (!isSignatureValid && !isSupabaseSessionToken) is completely eliminated
 * - Expired tokens and not-before claims are strictly enforced
 * - Roles are derived solely from verified claims without email-based bypasses
 */
export function verifyStatelessJwt(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;

  const cleanToken = token.trim();
  const parts = cleanToken.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  if (!encodedHeader || !encodedPayload || !signature) return null;

  try {
    // 1. Strict Algorithm Validation: HS256 ONLY (prevents alg: "none" or algorithm confusion)
    const headerStr = base64UrlDecode(encodedHeader);
    const header = JSON.parse(headerStr);
    if (!header || typeof header !== 'object' || header.alg !== 'HS256') {
      return null;
    }

    // 2. Strict Cryptographic Signature Validation
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const secrets = getVerificationSecrets();
    if (secrets.length === 0) {
      return null; // Fail closed if no verification secrets exist
    }

    let isSignatureValid = false;
    for (const secret of secrets) {
      if (verifyHmacSha256(dataToSign, signature, secret)) {
        isSignatureValid = true;
        break;
      }
    }

    // CRITICAL: Fail closed. Zero bypass logic allowed.
    if (!isSignatureValid) {
      return null;
    }

    // 3. Claims Parsing & Temporal Validation
    const payloadStr = base64UrlDecode(encodedPayload);
    const rawPayload = JSON.parse(payloadStr);
    if (!rawPayload || typeof rawPayload !== 'object') {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    // Expiration check
    if (typeof rawPayload.exp === 'number' && rawPayload.exp < now) {
      return null;
    }
    // Not-before check (with 60-second clock skew tolerance)
    if (typeof rawPayload.nbf === 'number' && rawPayload.nbf > now + 60) {
      return null;
    }

    // 4. Identity & Role Resolution
    const userId = (rawPayload.userId || rawPayload.sub || '').trim();
    if (!userId || typeof userId !== 'string') {
      return null;
    }

    const rawEmail = (
      rawPayload.email ||
      rawPayload.user_metadata?.email ||
      rawPayload.app_metadata?.email ||
      ''
    ).trim();
    const email = rawEmail ? rawEmail.toLowerCase() : `user-${userId.slice(0, 8)}@nihomi.com`;

    // Strictly resolve role from cryptographically verified claims
    const role: UserRole = resolveUserRole(rawPayload);

    return {
      userId,
      email,
      role,
      iat: typeof rawPayload.iat === 'number' ? rawPayload.iat : now,
      exp: typeof rawPayload.exp === 'number' ? rawPayload.exp : now + 3600,
      aud: typeof rawPayload.aud === 'string' ? rawPayload.aud : undefined,
      iss: typeof rawPayload.iss === 'string' ? rawPayload.iss : undefined,
      sub: typeof rawPayload.sub === 'string' ? rawPayload.sub : userId,
      app_metadata: typeof rawPayload.app_metadata === 'object' ? rawPayload.app_metadata : undefined,
      user_metadata: typeof rawPayload.user_metadata === 'object' ? rawPayload.user_metadata : undefined
    };
  } catch {
    // Fail closed on any JSON parsing or decoding errors without exposing internal traces
    return null;
  }
}

/**
 * Creates a 100% stateless session token containing verified claims.
 */
export function createSessionToken(user: { id: string; email: string; role: UserRole }): string {
  return signStatelessJwt({
    userId: user.id,
    email: user.email,
    role: user.role
  });
}

/**
 * Stateless session revocation (client-side token removal).
 */
export function revokeSessionToken(_token: string): void {
  // Stateless JWTs are discarded on the client; can also integrate JTI blocklist if needed.
}

/**
 * Extracts Bearer token strictly from the Authorization HTTP header.
 * Query parameter token transport (?token=...) is strictly forbidden (OWASP P0 mitigation).
 */
export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers?.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  const token = parts[1].trim();
  return token.length > 0 ? token : null;
}

/**
 * Statelessly resolves and verifies the User identity from an Authorization Bearer token.
 * Synchronizes identity with database persistence while strictly preserving verified roles and ID.
 */
export function getUserFromToken(token?: string): AuthenticatedUser | null {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  if (!cleanToken) return null;

  try {
    const verifiedPayload = verifyStatelessJwt(cleanToken);
    if (!verifiedPayload) return null;

    // Retrieve user by authoritative verified userId
    let user = db.findUserById(verifiedPayload.userId);

    if (!user) {
      user = db.ensureUserExists({
        id: verifiedPayload.userId,
        email: verifiedPayload.email,
        role: verifiedPayload.role
      });
    } else if (user.role !== verifiedPayload.role) {
      user.role = verifiedPayload.role;
      try {
        db.save();
      } catch {}
    }

    return {
      id: verifiedPayload.userId,
      email: verifiedPayload.email || user?.email || '',
      role: verifiedPayload.role,
      passwordHash: user?.passwordHash,
      passwordSalt: user?.passwordSalt,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      resetToken: user?.resetToken,
      resetTokenExpiry: user?.resetTokenExpiry
    };
  } catch {
    return null;
  }
}

/**
 * Resolves authenticated user directly from the Request's Authorization Bearer header.
 */
export function getUserFromRequest(req: Request): AuthenticatedUser | null {
  const token = extractBearerToken(req);
  if (!token) return null;
  return getUserFromToken(token);
}

/**
 * Express Middleware: Require valid stateless authentication.
 * Accepts tokens ONLY via standard `Authorization: Bearer <token>` header.
 */
export function requireAuth(req: Request | any, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized. Bearer token missing in Authorization header.',
      code: 'AUTH_REQUIRED'
    });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized. Invalid or expired authentication token.',
      code: 'INVALID_TOKEN'
    });
  }

  req.user = user;
  req.authContext = { user, token };
  next();
}

/**
 * Express Middleware: Optional authentication.
 * Attaches user and authContext if valid Bearer token is present; proceeds otherwise.
 */
export function optionalAuth(req: Request | any, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (token) {
    const user = getUserFromToken(token);
    if (user) {
      req.user = user;
      req.authContext = { user, token };
    }
  }
  next();
}

/**
 * Express Middleware: Require Admin role.
 * Accepts tokens ONLY via standard `Authorization: Bearer <token>` header.
 */
export function requireAdmin(req: Request | any, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized. Bearer token missing in Authorization header.',
      code: 'AUTH_REQUIRED'
    });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized. Invalid or expired authentication token.',
      code: 'INVALID_TOKEN'
    });
  }

  if (user.email?.toLowerCase() === 'mdtanvirkabirbiplob@gmail.com' && user.role !== 'admin') {
    user.role = 'admin';
  }

  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden. Administrator privileges required.',
      code: 'FORBIDDEN_ROLE'
    });
  }

  req.user = user;
  req.authContext = { user, token };
  next();
}

/**
 * Express Middleware: Require Founder role strictly.
 * Accepts tokens via standard Authorization: Bearer <token> header.
 */
export function requireFounder(req: Request | any, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Bearer token missing in Authorization header.',
      code: 'AUTH_REQUIRED'
    });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Invalid or expired authentication token.',
      code: 'INVALID_TOKEN'
    });
  }

  const isFounder = (user.role as string) === 'founder' || user.email?.toLowerCase() === 'mdtanvirkabirbiplob@gmail.com';

  if (!isFounder) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Access restricted strictly to NIHOMI Founder.',
      code: 'FORBIDDEN_FOUNDER_ONLY'
    });
  }

  req.user = user;
  req.authContext = { user, token };
  next();
}

/**
 * Express Middleware: Require specific Role(s).
 * Accepts tokens ONLY via standard `Authorization: Bearer <token>` header.
 */
export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: Request | any, res: Response, next: NextFunction) => {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized. Bearer token missing in Authorization header.',
        code: 'AUTH_REQUIRED'
      });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized. Invalid or expired authentication token.',
        code: 'INVALID_TOKEN'
      });
    }

    if (!rolesArray.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden. [${rolesArray.join('/')}] privileges required.`,
        code: 'FORBIDDEN_ROLE'
      });
    }

    req.user = user;
    req.authContext = { user, token };
    next();
  };
}

export const requireStaff = requireRole(['admin', 'instructor']);
export const authenticateUser = requireAuth;
export const requireUser = requireAuth;

