# SECURITY-POLICY.md — ENTERPRISE SECURITY & DATA PRIVACY CHARTER

**Security Posture**: Zero-Trust Architecture & Principle of Least Privilege  
**Guardian**: AI CISO & Founder  

---

## 1. Security Tenets
1. **Stateless Credential Isolation**:  
   Never store secrets, JWT keys, or database passwords in source code, client bundles, git history, or AI agent context prompts.
2. **Server-Side Token Verification**:  
   All authentication relies on cryptographically signed HMAC-SHA256 tokens verified server-side. No client-side bypasses allowed.
3. **Role-Based Access Control (RBAC)**:  
   Endpoints enforce strict role validation (`student`, `instructor`, `admin`, `founder`) via [rbac.ts](file:///c:/NIHOMI/nihomi-app/server/middleware/rbac.ts).
4. **Immutable Audit Trails**:  
   All administrative actions, manual payment verifications, and draft publishing events are recorded in durable database audit logs.
