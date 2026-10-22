---
trigger: always_on
description: Apply NIHOMI's Founder-approved product refinement protocol, domain consistency, evidence requirements, and release gates.
---

# NIHOMI Product Refinement — Persistent Rules

1. Before significant changes, read `docs/NIHOMI_PRODUCT_REFINEMENT_PROTOCOL.md`, the canonical `docs/NIHOMI_LEARNING_JOURNEY_SPEC.md`, the constitution, relevant rules, domain matrix, and current evidence/decision records.
2. Research and audit existing code before planning; document verified facts versus assumptions. Do not begin implementation while important architecture or scope questions remain unresolved.
3. Preserve existing working behavior, user changes, architecture, data, curriculum laws, security/cost controls, and approved decisions. Prefer small, reviewable vertical slices over broad rewrites.
4. Treat Japanese Learning, 7-Eleven-style POS simulation, Exam OS, and CV/履歴書 as domain adapters within a shared orchestration/refinement system. Retain each domain's own evidence and evaluation rules.
5. Nomi Sensei teaches; N.I.H.O.M.I Learning Loop selects, evaluates, records, and adapts learning; NIHOMI is the platform.
6. Enforce the existing Strict Cumulative Learning Lattice in curriculum/application logic. Keep prior knowledge, content introduction, practice, completion, mastery, and review states distinct.
7. **NO EVIDENCE = NO DONE.** Do not claim completion, skill mastery, accurate content, browser verification, security, or release readiness without appropriate evidence.
8. Run relevant automated checks and actual browser flows before handover. If a check/tool is unavailable, label the behavior unverified and report the blocker.
9. Keep Founder control over material scope/pedagogy changes, implementation acceptance, merge, and production launch.
10. After completing exactly one authorized task, stop. Present evidence and exactly one next-task proposal; do not start it before explicit approval. See `.agents/rules/nihomi-task-approval-gate.md` and `docs/NIHOMI_WORK_PACKAGE_APPROVAL_PROTOCOL.md`.
11. Never force-push, discard unrelated work, expose secrets, weaken access controls, change production data, merge, or publicly deploy without explicit authorization.
12. Update canonical documentation and evidence records rather than creating competing sources of truth.
