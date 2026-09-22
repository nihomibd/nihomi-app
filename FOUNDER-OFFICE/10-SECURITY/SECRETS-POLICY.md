# SECRETS-POLICY.md — CREDENTIAL & SECRET PROTECTION POLICY

**Zero-Tolerance Rule**: Committing or displaying secrets is a critical security violation.  

---

## 1. Protected Secret Classes
1. **Financial**: Bank logins, MFS merchant PINs, bKash App Secret, SSLCommerz Store Password, Stripe Secret Key.
2. **Cryptographic**: JWT Master Secret (`JWT_SECRET`), Supabase Service Role Key.
3. **Infrastructure**: Database passwords, Cloudflare API tokens, Vercel deployment tokens, Gemini API keys.
4. **User Secrets**: Passwords, OTP codes, session tokens, identification document files.

---

## 2. Safe Secrets Architecture
- All configurations must be referenced by environment variable name only (matching [.env.example](file:///c:/NIHOMI/nihomi-app/.env.example)).
- Code and documentation repositories must contain strictly template placeholders (e.g., `MY_GEMINI_API_KEY`).
- Secret injection occurs strictly at runtime via secure environment managers (Vercel Project Settings, Cloud Run Secret Manager).
