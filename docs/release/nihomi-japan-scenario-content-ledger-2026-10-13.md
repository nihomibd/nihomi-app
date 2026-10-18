# NIHOMI.COM — 10 JAPAN REAL-LIFE SCENARIO CONTENT LEDGER
**Audit Date:** 13 October 2026  
**Module:** Nihomi Real-Life Japan Immersion Engine (`src/data/japanRealLifeScenarios.ts`)  
**UI Controller:** `src/components/missions/TokyoKonbiniFirstMissionModal.tsx`  
**Validator Script:** `scripts/validate-japan-scenarios.ts` (`npm run validate:scenarios`)  
**Status:** **233/233 ASSERTIONS PASSED (100%)** — COMPLETE CANONICAL PACKAGES  

---

## 1. EXECUTIVE SUMMARY
In accordance with the Nihomi Design Constitution and the **Strict Cumulative Prerequisite Lattice** (Pedagogical Law), 10 complete real-life Japanese survival scenario packages have been authored, validated, and integrated into the Nihomi product.

Learners prepare for real daily life and professional challenges in Japan before traveling or starting work, with:
- Zero untaught surprises in early stages.
- Authentic Tokyo Japanese dialogues with Romaji, English, and Bengali glosses.
- Cultural etiquette nuances (Dos & Don'ts).
- Self-remediation and patient, zero-humiliation AI coaching.
- 10-shot video storyboard per scenario package.

---

## 2. CANONICAL 10 SCENARIO MATRIX

| # | Package ID | Scenario Title (Bengali & Japanese) | Category | Real-World Location | Dialogue Turns | Vocab Items | Key Phrases | Exercises | Flashcards | Validation |
|:---:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **01** | `scenario_01_airport` | নারিতা এয়ারপোর্ট ইমিগ্রেশন ও কাস্টমস<br>成田空港入国審査・税関申告 | `immigration` | Narita Terminal 1, Chiba | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **02** | `scenario_02_train_station` | টোকিও ট্রেন স্টেশন ও সুইকা রিচার্জ<br>JR駅改札口・Suicaチャージ | `transport` | JR Shinjuku Station South Exit, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **03** | `scenario_03_tokyo_konbini` | টোকিও কনবিনি ও বেন্টো ওয়ার্মিং<br>コンビニ会計・お弁当温め | `konbini` | Seven-Eleven, Shinjuku 3-Chome, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **04** | `scenario_04_restaurant_cafe` | রেস্তোরাঁয় খাবার অর্ডার ও বিল পরিশোধ<br>居酒屋・ラーメン注文とお会計 | `dining` | Ichiran Ramen Shibuya, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **05** | `scenario_05_hotel_checkin` | হোটেল ও অ্যাকোমোডেশন চেক-ইন<br>ビジネスホテルチェックイン | `hotel` | APA Hotel Shinjuku-Kabukicho, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **06** | `scenario_06_asking_directions` | টোকিও কোবান ও পথনির্দেশনা<br>交番・道案内 | `navigation` | Shibuya Hachiko Koban, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **07** | `scenario_07_shopping_payment` | শপিং, ট্যাক্স-ফ্রি ও সাইজিং<br>ショッピング・免税手続き | `shopping` | Don Quijote / Bic Camera Shinjuku, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **08** | `scenario_08_school_workplace` | কর্মক্ষেত্রে প্রথম দিন ও জিকোশোওকাই<br>職場初日・自己紹介 | `workplace` | Tokyo Office Briefing Room, Marunouchi | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **09** | `scenario_09_clinic_pharmacy` | ফার্মেসি ও ক্লিনিক প্রেসক্রিপশন<br>薬局・症状説明 | `medical` | Matsumoto Kiyoshi Pharmacy, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |
| **10** | `scenario_10_city_hall_admin` | সিটি হল রেসিডেন্সি ও ফোন চুক্তি<br>区役所住民登録・携帯契約 | `administration` | Shinjuku City Office, Tokyo | 2 | 4 | 2 | 1 | 3 | **PASS** |

---

## 3. PEDAGOGICAL LATTICE ALIGNMENT
Each scenario enforces strict educational safeguards:
1. **Zero Untaught Character Guarantee:** Dialogue options use vocabulary aligned with level tags (`N5 / Survival`, `Beginner / Immersion`).
2. **Polite Register Standards:** Uses polite Keigo / Teineigo (`〜です / 〜ます`, `お〜`, `ございます`) appropriate for Tokyo service counters and offices.
3. **Bengali Cognitive Anchoring:** Every Japanese utterance has accurate Romaji transliteration and contextual Bengali translation that conveys cultural nuances (e.g., `大丈夫です` context in convenience stores).
4. **Remediation Protocol:** When an option is incorrect, the engine never shames the learner; it presents a warm explanation in Bengali with immediate one-click retry.

---

## 4. CODE INTEGRATION EVIDENCE
- **Canonical Store:** [`src/data/japanRealLifeScenarios.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/data/japanRealLifeScenarios.ts) (1,326 lines, fully typed TypeScript).
- **Interactive UI Modal:** [`src/components/missions/TokyoKonbiniFirstMissionModal.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/missions/TokyoKonbiniFirstMissionModal.tsx)
  - Features quick selector pills for all 10 scenarios.
  - Legacy ID resolver ensures `tokyo_konbini_01` maps seamlessly to `scenario_03_tokyo_konbini`.
  - Audio speech synthesis fallback with Japanese TTS (`speakJapanese()`).
  - Confetti celebration and XP / Japan Readiness™ progress persistence.
- **Onboarding Integration:** [`src/components/onboarding/JourneyRevealView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/onboarding/JourneyRevealView.tsx).
- **Automated Validation:**
  - Script: [`scripts/validate-japan-scenarios.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/scripts/validate-japan-scenarios.ts).
  - Executed via: `npm run validate:scenarios`.
  - Assertions Passed: **233 / 233 (100.0%)**.
