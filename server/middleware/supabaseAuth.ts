import { Request, Response, NextFunction } from 'express';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Authenticated User Interface attached to Express Request
 */
export interface AuthenticatedUser {
  id: string; // Supabase auth UUID
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | string;
  studentId?: string; // e.g. NHM-XXXXXX from app_metadata or user_metadata
  metadata: Record<string, any>;
  rawUser?: SupabaseUser;
  [key: string]: any; // Preserves compatibility with existing User extensions
}

/**
 * Express Request augmentation
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Singleton Supabase Client instance
 */
let supabaseClientInstance: SupabaseClient | null = null;

/**
 * Retrieves the initialized Supabase client singleton instance.
 * Validates configuration and logs clear diagnostics in production vs development.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  const rawUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseUrl = rawUrl && !rawUrl.includes('placeholder') ? rawUrl : 'https://aiychtkhktwsjrieeaha.supabase.co';
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t').trim();

  const activeKey = supabaseServiceKey || supabaseAnonKey;

  if (!supabaseUrl || !activeKey) {
    const errorMsg =
      '[SupabaseAuth] Missing required Supabase credentials (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).';

    if (process.env.NODE_ENV === 'production') {
      console.error(`[CRITICAL SECURITY FATAL] ${errorMsg}`);
    } else {
      console.warn(`[SupabaseAuth Warning] ${errorMsg} Running in degraded mode.`);
    }

    throw new Error(errorMsg);
  }

  if (!supabaseServiceKey && supabaseAnonKey) {
    console.warn(
      '[SupabaseAuth Warning] SUPABASE_SERVICE_ROLE_KEY is not set; falling back to SUPABASE_ANON_KEY for JWT validation.'
    );
  }

  supabaseClientInstance = createClient(supabaseUrl, activeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return supabaseClientInstance;
}

/**
 * Safely extracts the Bearer token from the incoming Authorization header
 */
function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1].trim();
  }

  // Fallback: If header is passed as raw token without "Bearer " prefix
  if (parts.length === 1 && parts[0].includes('.')) {
    return parts[0].trim();
  }

  return null;
}

/**
 * Maps Supabase User record to a normalized Nihomi AuthenticatedUser
 */
function mapSupabaseUserToAuthenticatedUser(supabaseUser: SupabaseUser): AuthenticatedUser {
  const appMeta = supabaseUser.app_metadata || {};
  const userMeta = supabaseUser.user_metadata || {};

  // Resolve user email
  const email = supabaseUser.email || (userMeta.email as string) || '';

  // Extract explicit role or infer from founder / metadata
  const rawRole =
    (appMeta.role as string) ||
    (userMeta.role as string) ||
    (appMeta.user_role as string) ||
    'STUDENT';

  const isFounder = email.toLowerCase() === 'mdtanvirkabirbiplob@gmail.com';
  let normalizedRole: 'STUDENT' | 'TEACHER' | 'ADMIN' | string = rawRole.toUpperCase();

  if (isFounder) {
    normalizedRole = 'ADMIN';
  } else if (normalizedRole === 'USER' || normalizedRole === 'LEARNER') {
    normalizedRole = 'STUDENT';
  } else if (normalizedRole === 'INSTRUCTOR' || normalizedRole === 'STAFF') {
    normalizedRole = 'TEACHER';
  }

  // Extract student ID (e.g. NHM-100234)
  const studentId =
    (appMeta.student_id as string) ||
    (appMeta.studentId as string) ||
    (userMeta.student_id as string) ||
    (userMeta.studentId as string) ||
    (userMeta.nhm_id as string) ||
    undefined;

  return {
    id: supabaseUser.id,
    email,
    role: normalizedRole,
    studentId,
    metadata: {
      ...appMeta,
      ...userMeta
    },
    rawUser: supabaseUser
  };
}

/**
 * Enterprise-grade Supabase Authentication Middleware (Mandatory Authentication)
 * 
 * Verifies the JWT cryptographically via Supabase Auth service.
 * Enforces stateless verification across all distributed serverless/container instances.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = extractBearerToken(req);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Bearer token required'
    });
    return;
  }

  let supabase: SupabaseClient;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authentication service configuration error'
    });
    return;
  }

  try {
    // Cryptographically verify token against Supabase Auth engine
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: error?.message || 'Invalid, expired, or revoked token'
      });
      return;
    }

    // Attach validated student/user credentials to Express Request
    req.user = mapSupabaseUserToAuthenticatedUser(data.user);
    next();
  } catch (err: any) {
    console.error('[SupabaseAuth] Token validation exception:', err);
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Token verification failed'
    });
  }
}

/**
 * Alias for requireAuth
 */
export const authenticateUser = requireAuth;

/**
 * Optional Supabase Authentication Middleware
 * 
 * If a valid Bearer token is provided, attaches `req.user`.
 * If no token is provided, proceeds anonymously without error.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (!error && data?.user) {
      req.user = mapSupabaseUserToAuthenticatedUser(data.user);
    }
  } catch {
    // Quiet fallback for optional authentication
  }

  next();
}

/**
 * Role-Based Access Control (RBAC) Higher-Order Middleware
 * 
 * Verifies that the authenticated user possesses one of the allowed roles.
 * Must be mounted after `requireAuth` or will automatically invoke `requireAuth` if `req.user` is absent.
 * 
 * @param allowedRoles Array of acceptable roles (e.g. ['ADMIN'], ['STUDENT', 'TEACHER'])
 */
export function requireRole(allowedRoles: string | string[]) {
  const rolesList = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map((r) =>
    r.toUpperCase()
  );

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
      return;
    }

    const currentRole = (req.user.role || '').toUpperCase();
    const isAuthorized = rolesList.includes(currentRole);

    if (!isAuthorized) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Forbidden: Access restricted to [${rolesList.join(', ')}] roles`,
        currentRole: req.user.role,
        requiredRoles: rolesList
      });
      return;
    }

    next();
  };
}

/**
 * Student Tenant / Resource Isolation Middleware (Anti-IDOR Gate)
 * 
 * Prevents Insecure Direct Object References (IDOR) by guaranteeing
 * that a student can only view or mutate their own records (`req.params[paramName] === req.user.id`).
 * Administrators and Teachers can optionally be allowed to bypass isolation for management.
 * 
 * @param paramName Route parameter key containing the target user ID (default: 'userId')
 * @param options Optional configuration (allowBypassRoles: roles permitted to inspect other users)
 */
export function verifyResourceOwnership(
  paramName: string = 'userId',
  options: { allowBypassRoles?: string[] } = { allowBypassRoles: ['ADMIN', 'TEACHER'] }
) {
  const bypassRoles = (options.allowBypassRoles || []).map((r) => r.toUpperCase());

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
      return;
    }

    const currentRole = (req.user.role || '').toUpperCase();

    // Check if role is authorized to bypass tenant isolation (e.g. ADMIN or TEACHER)
    if (bypassRoles.includes(currentRole)) {
      return next();
    }

    const targetUserId = req.params[paramName] || (req.query[paramName] as string);

    if (!targetUserId) {
      res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: `Missing required resource parameter: :${paramName}`
      });
      return;
    }

    // Strict multi-tenant isolation check
    if (targetUserId !== req.user.id) {
      console.warn(
        `[Tenant Isolation Violation] User ${req.user.id} (${req.user.email}) attempted unauthorized access to resource belonging to ${targetUserId}`
      );
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Resource access denied. You are only authorized to access your own student data.'
      });
      return;
    }

    next();
  };
}
