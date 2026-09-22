# BUG-POLICY.md — DEFECT MANAGEMENT & RESOLUTION POLICY

---

## 1. Defect SLAs & Prioritization
- **P0 Blocker (SLA < 2 hours)**: Crash on checkout, broken auth token, app unresponsive.
- **P1 Severe (SLA < 12 hours)**: Lesson audio failure, incorrect quiz scoring, misaligned furigana.
- **P2 Moderate (SLA < 48 hours)**: Minor visual overflow on mobile screens, latency spikes.
- **P3 Minor (SLA: Next Sprint)**: Typo in English/Bengali explanation, cosmetic animation glitch.

---

## 2. Bug Verification Mandate
A bug is not resolved until a regression test or verification script confirms the fix without breaking existing capabilities.
