# RELEASE-POLICY.md — PRODUCTION RELEASE & ROLLBACK GOVERNANCE

---

## 1. Release Gating
- **Zero-Stub Rule**: No pull request with placeholder functions, fake timeouts, or incomplete TODOs may be merged.
- **Verification Prerequisite**: `npm run build` and `npm run lint` must exit code 0.
- **Rollback Readiness**: Every release must have a known commit hash to revert within 60 seconds if unexpected errors occur.
- **Founder Release Gate**: Production deploys require final sign-off from Founder.
