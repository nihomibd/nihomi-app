export { requireAuth, optionalAuth, requireAdmin, requireRole, requireStaff, authenticateUser, requireUser } from '../authHelper.js';
export { requireOwnerOrAdmin } from './rbac.js';
export type { AuthenticatedRequest } from '../authHelper.js';
export {
  requireAuth as requireSupabaseAuth,
  authenticateUser as authenticateSupabaseUser,
  optionalAuth as optionalSupabaseAuth,
  requireRole as requireSupabaseRole,
  verifyResourceOwnership,
  getSupabaseAdminClient
} from './supabaseAuth.js';
export type { AuthenticatedUser } from './supabaseAuth.js';
