# PUBLISHING-RULES.md — PRODUCTION CURRICULUM PUBLISHING RULES

---

## 1. Zero Hallucination Guarantee
No AI-generated grammar explanation or quiz question may be published without passing through the Content QA linter and human/founder confirmation.

## 2. Version Control & Rollback
- Every published lesson creates an immutable version record in the database (`ContentVersion`).
- In the event of a reported error, any lesson can be reverted to its previous stable version with 1-click in Content Studio.

## 3. Immediate Student Provisioning
Upon publication, SRS vocabulary cards are automatically generated and queued for enrolled students, ensuring active learners receive the content in their daily review queues.
