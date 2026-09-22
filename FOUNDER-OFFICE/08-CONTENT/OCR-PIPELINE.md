# OCR-PIPELINE.md — DOCUMENT UNDERSTANDING & TEXT EXTRACTION SPEC

**Component Target**: `server/services/contentEngineService.ts`  

---

## 1. Document Parsing Rules
- **Multi-Script OCR**: Accurate recognition of complex Kanji alongside Hiragana, Katakana, and Romaji.
- **Furigana Preservation**: OCR models must preserve reading rubies above complex Kanji rather than merging them into corrupted text strings.
- **Table & Layout Parsing**: Structured retention of grammar conjugation tables (Te-form, Nai-form, Potential-form).
- **Asynchronous Execution**: Heavy PDF jobs execute asynchronously via background queue to prevent blocking the Express server event loop.
