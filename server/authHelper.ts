import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { User, UserRole } from './types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nihomi-secret-key-prod-2026';

// In-memory active session token map: token -> { userId, expiresAt }
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export function createSessionToken(user: User): string {
  const token = `nihomi_${crypto.randomBytes(32).toString('hex')}`;
  // 30 days expiration
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  sessions.set(token, { userId: user.id, expiresAt });
  return token;
}

export function revokeSessionToken(token: string): void {
  sessions.delete(token);
}

export function getUserFromToken(token?: string): User | null {
  if (!token) return null;
  const cleanToken = token.replace('Bearer ', '').trim();
  const session = sessions.get(cleanToken);
  
  if (session) {
    if (session.expiresAt < Date.now()) {
      sessions.delete(cleanToken);
      return null;
    }
    return db.findUserById(session.userId) || null;
  }

  return null;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader || (req.query.token as string);
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  req.user = user;
  next();
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader || (req.query.token as string);
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }

  req.user = user;
  next();
}

export const authenticateUser = requireAuth;
export const requireUser = requireAuth;

