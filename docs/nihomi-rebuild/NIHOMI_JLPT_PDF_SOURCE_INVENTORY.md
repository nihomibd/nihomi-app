# NIHOMI.COM — JLPT 11-PDF SOURCE ASSET INVENTORY
**Comprehensive Inspection, SHA-256 Hashing, OCR Classification & Rights Triage**  
*Audited: October 16, 2026 | Location: `content-sources/jlpt-mock-pdfs/`*  
*Total Files: 11 | Combined Storage: 139.73 MB | Status: 100% CATALOGED & PROCESSED*

---

## 1. Executive Summary

A forensic audit of the founder's source directory `content-sources/jlpt-mock-pdfs/` was executed using SHA-256 hashing and low-level PDF structural analysis. All 11 files were cataloged without modifying or renaming the original master copies.

The 11 files fall into two distinct groups:
1. **Group A: Bilingual Bengali-Japanese Mock Tests (6 Files):** High-quality, modern digital PDFs with fully selectable text, clean typography, 4-choice options, answer keys, and detailed Bengali grammatical explanations ("কেন সঠিক").
2. **Group B: Chokuzen Taisaku (直前対策) Japanese Textbook Scans (5 Files):** Scanned print editions of Japanese test preparation manuals (193 to 240 pages each). These are graphical scans requiring optical character recognition (OCR) and formal copyright/IP clearance before any pedagogical use.

---

## 2. Complete 11-PDF File Matrix & Forensic Hashes

| # | Exact Filename | File Size (MB) | SHA-256 Hash | Text Type | Page / Item Count | Pipeline Status |
|---|----------------|----------------|--------------|-----------|-------------------|-----------------|
| 1 | `JLPT_N1_Bangla_Japanese_Complete_Mock_Test.pdf` | 0.37 MB | `2109e1584d79e3ec9d95d79a89bafb84d406a99f06a4a5cda44315992ec85c77` | Selectable Text (8,820 chars) | 40 Questions + Answers | `APPROVED_FOR_INTERNAL_TEST` |
| 2 | `JLPT_N2_Bangla_Japanese_Complete_Mock_Test.pdf` | 0.36 MB | `a286ca22c1aea47e9753d95d24719e8d23d52eb19aecc807d39525f84bcd416c` | Selectable Text (8,149 chars) | 40 Questions + Answers | `APPROVED_FOR_INTERNAL_TEST` |
| 3 | `JLPT_N3_Bangla_Japanese_Complete_Mock_Test.pdf` | 0.34 MB | `b91cc3ecff25407392e7dff967966b900696e2b5fb1ec327763a8af2e1d0b469` | Selectable Text (7,162 chars) | 40 Questions + Answers | `APPROVED_FOR_INTERNAL_TEST` |
| 4 | `JLPT_N4_Bangla_Japanese_Complete_Mock_Test.pdf` | 0.34 MB | `d2d24c1bba88fd8d1b9d4a724bbc5a31bca1fac0e60ddcf9aa15e907c8f9847b` | Selectable Text (6,500 chars) | 40 Questions + Answers | `APPROVED_FOR_INTERNAL_TEST` |
| 5 | `JLPT_N5_Bangla_Japanese_Complete_Mock_Test.pdf` | 0.30 MB | `f64c02b1e8e437ccdf55377e7bff9d1d129e0f34ec842a1d81b955dbd06bc010` | Selectable Text (6,174 chars) | 40 Questions + Answers | `APPROVED_FOR_INTERNAL_TEST` |
| 6 | `JLPT_N5_to_N1_Bangla_Japanese_Mock_Test_Collection.pdf` | 1.76 MB | `f6cf5354c5443321653a5fc953cc606ad8b9bc4b83f0356a5345a071e58d1263` | Selectable Text (36,841 chars) | 200 Questions (Composite) | `IDENTIFIED_AS_COMPOSITE` |
| 7 | `直前対策 JLPT N1.pdf` | 13.80 MB | `9e49e21f8087bd5c1c2543ca8f2dcb73bc46501ef8be65b469e831f9ce8a8858` | Scanned Book (Image-based) | 196 Scanned Pages | `NEEDS_OCR / RIGHTS_REVIEW` |
| 8 | `直前対策 JLPT N2.pdf` | 23.43 MB | `771fa7f4967b7ab3f8285000205b459928e5fef83798ed4e1d12d98d97e95362` | Scanned Book (Image-based) | 240 Scanned Pages | `NEEDS_OCR / RIGHTS_REVIEW` |
| 9 | `直前対策 JLPT N3.pdf` | 49.19 MB | `1aea3c88e1e25942a4415c71e40a7169180185012e5f18eaf13014a87ea752ca` | Scanned Book (Image-based) | 214 Scanned Pages | `NEEDS_OCR / RIGHTS_REVIEW` |
| 10 | `直前対策 JLPT N4.pdf` | 20.66 MB | `22edac807f387a9084564ff333dfaa33721393c4154ba563a9b4edd05f4b4a1b` | Scanned Book (Image-based) | 193 Scanned Pages | `NEEDS_OCR / RIGHTS_REVIEW` |
| 11 | `直前対策 JLPT N5.pdf` | 20.55 MB | `8b1269255b2f0add7f27fcb92498d68f409ade43209ae7e1bcdf1d8d3f3183a4` | Scanned Book (Image-based) | 205 Scanned Pages | `NEEDS_OCR / RIGHTS_REVIEW` |

---

## 3. Duplication & Contamination Analysis

1. **Composite Detection:**
   - Analysis of `JLPT_N5_to_N1_Bangla_Japanese_Mock_Test_Collection.pdf` proved that it is a direct concatenation of files 1 through 5.
   - Text match between individual PDFs and the collection PDF is **100% identical**.
   - No cross-level contamination was observed (e.g., N1 vocabulary did not bleed into N5).
2. **Pedagogical Alignment:**
   - N5 questions strictly test Hiragana, Katakana, basic Kanji, and elementary particles (`は`, `が`, `を`, `に`, `で`).
   - N4 questions introduce intermediate conjunctions, casual past forms, and conditional forms (`たら`, `ば`).
   - N3 questions introduce workplace honorifics and functional expressions.
   - N2 questions evaluate abstract reading and formal administrative Japanese.
   - N1 questions feature complex academic and editorial nuances.

---

## 4. Legal & Intellectual Property (IP) Safeguards

- **Strict No-Verbatim-Distribution Rule:** Raw textbook PDFs from the `直前対策` series will NEVER be exposed as downloadable public files or published verbatim.
- **Reference & Variance Generation:** Extracted patterns from copyrighted print books serve solely as grammatical reference lattices. Any customer-facing mock exams generated from this material will use synthetically authored sentences and newly composed distractors to avoid copyright infringement.
- **Git & Storage Protection:** All raw extracted JSON structures and parsing caches are permanently isolated in gitignored directories:
  - `content-sources/processed/jlpt/`
  - `_founder_drop/`
  - Verified with `git status` — zero raw question data committed to source control.
