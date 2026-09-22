# FOUNDER-APPROVAL.md — CONTENT STUDIO FOUNDER GATE

---

## 1. The Founder Gate Protocol
In accordance with `server/routes/contentEngine.ts` and `src/views/ContentStudioView.tsx`, the publishing endpoint requires:
```json
{
  "founderApproved": true,
  "founderNotes": "Verified N5 Lesson batch 1-5"
}
```
If `founderApproved` is false or missing, the API rejects the publish command with HTTP 403 Forbidden.

---

## 2. Review Checklist for the Founder
- Are the cultural notes accurate and respectful?
- Does the difficulty level match the intended JLPT tier?
- Are the Bengali explanations helpful and encouraging?
