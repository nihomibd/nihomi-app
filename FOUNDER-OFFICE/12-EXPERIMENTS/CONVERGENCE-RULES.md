# CONVERGENCE-RULES.md — EXPERIMENT TERMINATION & CONVERGENCE RULES

---

## 1. Rules of Convergence
1. **Minimum Duration**: An experiment must run for at least 7 full days to account for day-of-week behavioral variation.
2. **Statistical Confidence**: Results must achieve 95% statistical significance (p < 0.05) before declaring a winner.
3. **Downstream Revenue Check**: A variant increasing click-through rate (CTR) but decreasing final subscription renewals is considered a **FAILURE** and must be rejected.
4. **Permanent Adoption**: Winning variants are merged into default platform configuration and logged in [LESSONS-LEARNED.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/01-COMPANY-BRAIN/LESSONS-LEARNED.md).
