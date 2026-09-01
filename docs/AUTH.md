# NIHOMI.COM — AUTHENTICATION & RBAC SPECIFICATION

## 1. Authentication Architecture

Nihomi supports two unified authentication mechanisms:
1. **Supabase Authentication (Frontend)**:
   - Google 1-Click OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
   - Magic Link and Email/Password sessions with automatic refresh.
2. **Stateless JWT API Verification (Backend)**:
   - Express backend verifies JWT tokens sent in `Authorization: Bearer <token>` header.
   - Tokens carry `userId`, `email`, `role`, and expiration timestamp (`exp`).

## 2. Role-Based Access Control (RBAC) Hierarchy

| Role | Permissions |
|------|-------------|
| `STUDENT` | Access to enrolled courses, practice quizzes, AI Coach (within quota), BaitoOS simulations, and profile settings. |
| `INSTRUCTOR` | All Student permissions + access to student progress monitoring, custom quiz creation, and course review tools. |
| `ADMIN` | All Instructor permissions + Content Studio publishing, user account management, coupon creation, and billing audit logs. |
| `FOUNDER` | Unrestricted superadmin access to financial metrics, system health, revenue trends, and developer command center. |

## 3. Middleware Implementation
- `requireAuth`: Enforces valid user identity on protected routes.
- `requireAdmin`: Rejects non-admin requests with HTTP 403 Forbidden.
- `requireRole(['admin', 'instructor'])`: Protects educational management endpoints.
- `requireOwnerOrAdmin`: Validates resource ownership for user-specific data access.
