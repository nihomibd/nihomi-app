# FEATURE-POLICY.md — FEATURE DEVELOPMENT & PRODUCT LIFECYCLE

**Standard**: 11-Stage Rigorous Product Engineering Pipeline  
**Sequence**: `DETECT → RESEARCH → PROPOSE → DESIGN → BUILD → TEST → SECURITY REVIEW → APPROVAL/AUTONOMOUS GATE → DEPLOY → MONITOR → ROLLBACK/IMPROVE`  

---

## 1. The 11-Stage Feature Lifecycle

1. **DETECT**: Identify student learning hurdle, drop-off metric, or founder strategic directive.
2. **RESEARCH**: Examine competitive pedagogy, Japanese language standards, and technical feasibility.
3. **PROPOSE**: Draft feature specification in [PRODUCT/](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/07-PRODUCT/) outlining user value and KPIs.
4. **DESIGN**: Construct UX wireframes respecting the 10X Futuristic Neo-Tokyo aesthetic (#0a0a12, Hanabi effects).
5. **BUILD**: Implement clean, production-grade TypeScript and React 19 code without mock stubs.
6. **TEST**: Execute local test suites; verify zero lint or compile warnings (`npm run lint`, `npm run build`).
7. **SECURITY REVIEW**: Verify `aiCostGuard` integration, input sanitization, and token security.
8. **APPROVAL / AUTONOMOUS GATE**: Submit PR for review; RED items require Founder sign-off.
9. **DEPLOY**: Push build artifacts to staging / production via Vercel and Cloudflare.
10. **MONITOR**: Track latency, error rates, and user engagement metrics post-launch.
11. **ROLLBACK / IMPROVE**: Rapid revert if defect detected; otherwise record learnings in Company Memory.
