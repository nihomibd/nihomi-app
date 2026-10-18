# NIHOMI.COM — ARCHITECTURAL REBUILD DECISION RECORD (ADR-006)

**Decision Title:** Controlled Rebuild & Preservation of Verified Assets vs Greenfield Rewrite  
**Date:** 2026-10-16  
**Status:** 🟢 APPROVED & IMPLEMENTED  
**Deciders:** Founder & Lead System Architect  

---

## 1. CONTEXT & PROBLEM STATEMENT

The founder requested that the entire Nihomi platform feel newly and consistently designed—starting from the landing page—while delivering an October 2026 production-candidate experience.

Two architectural strategies were evaluated:
1. **Option A (Blind Greenfield Rewrite):** Discard existing workspace, start from blank folder, rewrite all routing, components, and backend APIs from scratch.
2. **Option B (Controlled Rebuild & Vertical Slice Delivery):** Protect all verified working code, canonical 12-price matrix, curriculum graph, role security, and PWA foundation; systematically refactor the visual presentation and landing page using approved Brand Constitution tokens; implement Nihomi WorkOS™ and ingest the 5 verified JLPT mock-test PDFs.

---

## 2. DECISION & RATIONALE

**Decision: Adopt Option B (Controlled Rebuild).**

### Key Rationale:
1. **Preservation of Mission-Critical Assets:** 
   - 233/233 validated Japan scenario assertions.
   - 17/17 validated curriculum lattice rules.
   - 12/12 canonical pricing combinations.
   - 5/5 role authorization guards.
   - 15 verified browser QA scenarios and screenshots.
   - Discarding these would waste weeks of validated engineering.
2. **Strict Single Source of Truth:**
   - Prevents divergent repositories or duplicate implementations.
   - Guarantees backward compatibility for existing learner progress.
3. **Evidence-Gated Delivery:**
   - Every phase produces verifiable artifacts, passing tests, and actual browser screenshots.

---

## 3. CONSEQUENCES & SAFEGUARDS

- **Positive:** Rapid progress towards October candidate target with zero regression of core learning and billing logic.
- **Safeguard:** Hard stop on git push, main merge, or cloud deployment until founder explicitly reviews local browser outputs.
