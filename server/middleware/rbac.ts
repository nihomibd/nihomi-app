import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, getUserFromToken } from '../authHelper.js';
import { UserRole } from '../types.js';

export interface RbacOptions {
  errorMessage?: string;
  allowSelf?: {
    paramKey?: string;
    bodyKey?: string;
  };
}

/**
 * Server-Side Role-Based Access Control (RBAC) Gate
 * 
 * Enforces role restrictions at the HTTP router level to prevent privilege escalation.
 * 
 * @param allowedRoles Single role or array of authorized roles (e.g. ['admin', 'instructor'])
 * @param options Optional custom error messaging or self-ownership bypass
 */
export function requireRole(allowedRoles: UserRole | UserRole[], options: RbacOptions = {}) {
  const rolesArray: UserRole[] = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader || (req.query.token as string);
    const user = req.user || getUserFromToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
        code: 'UNAUTHORIZED'
      });
    }

    req.user = user;

    // Check if user has an explicitly allowed role
    if (rolesArray.includes(user.role)) {
      return next();
    }

    // Optional self-ownership bypass (e.g. user updating their own profile)
    if (options.allowSelf) {
      const targetParam = options.allowSelf.paramKey ? req.params[options.allowSelf.paramKey] : undefined;
      const targetBody = options.allowSelf.bodyKey ? req.body?.[options.allowSelf.bodyKey] : undefined;
      if ((targetParam && targetParam === user.id) || (targetBody && targetBody === user.id)) {
        return next();
      }
    }

    // Role check failed -> Forbidden
    console.warn(`[RBAC Gate] Access denied: User ${user.email} (Role: ${user.role}) attempted to access ${req.method} ${req.originalUrl}. Required: [${rolesArray.join(', ')}]`);
    return res.status(403).json({
      success: false,
      error: options.errorMessage || `Forbidden. Access restricted to [${rolesArray.join('/')}] roles.`,
      code: 'FORBIDDEN_ROLE',
      requiredRoles: rolesArray,
      currentRole: user.role
    });
  };
}

/**
 * Require Admin role strictly
 */
export const requireAdmin = requireRole('admin', {
  errorMessage: 'Forbidden. Administrator privileges required.'
});

/**
 * Require Staff privileges (Admin or Instructor)
 */
export const requireStaff = requireRole(['admin', 'instructor'], {
  errorMessage: 'Forbidden. Staff or instructor credentials required.'
});

/**
 * Require resource ownership or admin role
 */
export function requireOwnerOrAdmin(paramKey = 'userId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader || (req.query.token as string);
    const user = req.user || getUserFromToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
        code: 'UNAUTHORIZED'
      });
    }

    req.user = user;

    if (user.role === 'admin') {
      return next();
    }

    const targetUserId = req.params[paramKey] || req.body?.[paramKey];
    if (targetUserId && targetUserId === user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden. You do not have permission to modify this resource.',
      code: 'FORBIDDEN_OWNERSHIP'
    });
  };
}
