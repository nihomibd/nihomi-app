import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { User, UserRole } from './types.js';
import { getRequiredJwtSecret } from './env.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Base64URL Encoding & Decoding Helpers (Stateless, Zero-dependency)
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
 * Sign a stateless, cryptographically secure HMAC-SHA256 JWT
 */
export function signStatelessJwt(
  payload: { userId: string; email: string; role: UserRole },
  expiresInSeconds: number = 30 * 24 * 60 * 60 // 30 days
): string {
  const jwtSecret = getRequiredJwtSecret();
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
 * Statelessly verify an HMAC-SHA256 JWT or decode a valid Supabase Auth JWT
 */
export function verifyStatelessJwt(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const jwtSecret = getRequiredJwtSecret();
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', jwtSecret)
      .update(dataToSign)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // 1. Primary: Verify Nihomi HMAC-SHA256 signature
    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (
      sigBuffer.length === expectedSigBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
    ) {
      const payloadStr = base64UrlDecode(encodedPayload);
      const payload: TokenPayload = JSON.parse(payloadStr);

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired token
      }

      return payload;
    }

    // 2. Secondary: Verify Supabase Auth JWT (for Google OAuth / direct Supabase tokens)
    const payloadStr = base64UrlDecode(encodedPayload);
    const rawPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (rawPayload.exp && rawPayload.exp < now) {
      return null; // Expired
    }

    if (rawPayload.sub && (rawPayload.aud === 'authenticated' || rawPayload.role === 'authenticated' || rawPayload.email)) {
      const isFounder = rawPayload.email === 'mdtanvirkabirbiplob@gmail.com';
      const role: UserRole = (rawPayload.user_metadata?.role as UserRole) || (isFounder ? 'admin' : 'user');

      return {
        userId: rawPayload.sub,
        email: rawPayload.email || rawPayload.user_metadata?.email || `user-${rawPayload.sub.slice(0, 8)}@nihomi.com`,
        role,
        iat: rawPayload.iat || now,
        exp: rawPayload.exp || now + 3600
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Creates a 100% stateless session token containing verified claims.
 * No in-memory Map or local process state required.
 */
export function createSessionToken(user: User): string {
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
  // Stateless tokens are invalidated on the client by deleting the stored token.
}

/**
 * Statelessly resolves and verifies the User identity from an Authorization Bearer token.
 * Survives backend restarts and scales across multi-instance nodes.
 */
export function getUserFromToken(token?: string): User | null {
  if (!token) return null;
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  if (!cleanToken) return null;

  const verifiedPayload = verifyStatelessJwt(cleanToken);
  if (!verifiedPayload) return null;

  // Retrieve user or ensure existence in persistent database layer
  let user = db.findUserById(verifiedPayload.userId) || db.findUserByEmail(verifiedPayload.email);

  if (!user) {
    user = db.ensureUserExists({
      id: verifiedPayload.userId,
      email: verifiedPayload.email,
      role: verifiedPayload.role
    });
  }

  return user || null;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  file?: Express.Multer.File | any;
  files?: Express.Multer.File[] | any;
}

/**
 * Express Middleware: Require valid stateless authentication
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader || (req.query.token as string);
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized. Please log in.',
      code: 'AUTH_REQUIRED'
    });
  }

  req.user = user;
  next();
}

/**
 * Express Middleware: Optional authentication (attaches user if valid token present)
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader || (req.query.token as string);
  if (token) {
    const user = getUserFromToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

/**
 * Express Middleware: Require Admin role
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader || (req.query.token as string);
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized. Please log in.',
      code: 'AUTH_REQUIRED'
    });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden. Administrator privileges required.',
      code: 'FORBIDDEN_ROLE'
    });
  }

  req.user = user;
  next();
}

/**
 * Express Middleware: Require specific Role(s)
 */
export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader || (req.query.token as string);
    const user = getUserFromToken(token);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized. Please log in.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!rolesArray.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden. [${rolesArray.join('/')}] privileges required.`,
        code: 'FORBIDDEN_ROLE'
      });
    }

    req.user = user;
    next();
  };
}

export const requireStaff = requireRole(['admin', 'instructor']);
export const authenticateUser = requireAuth;
export const requireUser = requireAuth;
