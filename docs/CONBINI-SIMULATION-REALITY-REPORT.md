# NIHOMI CONBINI SHIFT SIMULATOR — REALISM & WORKPLACE IMMERSION PASS

**Target System**: `src/components/simulation/ConbiniPosCashierSimulator.tsx`  
**Scenario Engine**: `src/data/conbiniScenarios.ts`  
**Audio Synthesis**: `src/lib/soundEffects.ts`  
**Hub View**: `src/views/BaitoOsView.tsx`  
**Status**: PRODUCTION READY (Clean Build, 0 Type Errors, Zero External Audio Dependencies)

---

## 1. MISSION & GOAL
To transform Nihomi's static Conbini POS / Baito simulation into an authentic, immersive, high-fidelity Japanese Convenience Store Workplace Simulator.

A language learner in Bangladesh practicing this simulator will experience the exact rhythm, sequence, Keigo nuances, and payment handling of a real Tokyo 7-Eleven, Lawson, or FamilyMart semi-self register—eliminating workplace anxiety and panic on Day 1 in Japan.

---

## 2. ARCHITECTURAL & WORKFLOW OVERHAUL

### Stage 1: Customer Entry & Greeting (来店・挨拶)
- **Entrance Audio**: FamilyMart/7-Eleven style entrance chime synthesized via Web Audio (`playConbiniChime()`).
- **Cashier Call**: Mandatory initial greeting: 「いらっしゃいませ！」 (*Irasshaimase!*).
- **Interactive Speech**: Supported via Web Speech Recognition (voice drill) or tap-to-greet.
- **Dynamic Customer Response**: The customer dynamically responds (e.g. 「どうも、お願いします」) with Tokyo native TTS synthesis.

### Stage 2: Individual Barcode Scanning (バーコードスキャン)
- **Conveyor Belt UI**: Realistic item belt display showing item icons, Japanese names, prices, and barcodes.
- **Laser Scanner Animation**: When an item is scanned, a red laser line sweeps across the barcode graphic.
- **Scanner Audio**: Authentic 2400Hz crisp scanner beep (`playBarcodeBeep()`).
- **POS Display**: Scanned items immediately append to the virtual POS terminal screen with real-time running subtotal.
- **Bulk Scan**: Includes an 「一括スキャン (Scan All)」 shortcut for rapid training cycles.

### Stage 3: Dynamic Service Inquiries (接客確認)
*Crucial Realism Shift*: Eliminated all static telepathic preference badges. Cashier must ask questions in natural order, and customer replies dynamically:
1. **Point Card Inquiry** (「ポイントカードはお持ちですか？」): Customer announces card (e.g. d-Point, Ponta) or declines.
2. **Bento Warming Inquiry** (「お弁当温めますか？」):
   - Only enabled for heatable items.
   - If accepted: Triggers the **Commercial 1500W Microwave Simulation** (microwave chamber glows, digital countdown runs, and door pops open with authentic triple-beep chime `playMicrowaveChime()`).
3. **Bag Selection Inquiry** (「レジ袋はご利用ですか？」):
   - Customer answers (wants small/large bag, or has my-bag and asks for tape seal).
   - If accepted: Automatically adds bag fee (+¥5) to POS subtotal with dedicated line item.
4. **Utensils & Wet Wipe Inquiry** (「お箸はお付けしますか？」): Customer requests chopsticks ("一膳"), spoon, or wet wipe (oshibori).
5. **Age Verification** (酒類・タバコ 年齢確認): If age-restricted items are scanned, the terminal prompts age 20+ touchscreen verification.

### Stage 4: Authentic Japanese Semi-Self Payment Engine (デュアルスクリーン・セミセルフ決済)
Simulates modern Japanese convenience store semi-self registers (Toshiba Tec / NEC / Teraoka dual-screen design):
- **Customer-Facing Screen**: Displays 「お支払方法をお選びください」 with 4 distinct payment options:
  1. **現金 (Cash)**:
     - Customer tenders cash (e.g. ¥10,000 bill, ¥1,000 bills, or exact coins).
     - Cashier enters amount received.
     - Cash drawer springs open visually with heavy mechanical latch and slide sound (`playCashDrawerSound()`).
     - Terminal displays exact change (`お釣り: ¥...`).
     - Japanese speech output: 「〜円お預かりいたします。〜円のお返しとレシートでございます。」
  2. **交通系IC (Suica / Pasmo / ICOCA)**:
     - Contactless RFID reader ring illuminates with pulsing green/blue LED.
     - Customer taps card or Apple Pay.
     - Iconic two-step transit chime triggers (`playIcCardChime()`) with approval tone.
  3. **バーコード決済 (PayPay / d払い / au PAY)**:
     - Customer's smartphone screen pops up displaying the active barcode.
     - Cashier triggers handheld scanner, red laser sweeps across phone.
     - Authentic PayPay cheerful upward chime (`playPayPaySound()`) triggers approval.
  4. **クレジットカード (Credit Card / Contactless)**:
     - Customer inserts chip card or taps contactless VISA/Mastercard.
     - Chip read animation and terminal ping (`playCreditCardChipSound()`) approve payment.

### Stage 5: Handover & Closing (レシート発行・お見送り)
- **Thermal Receipt Printer**: Mechanical stepper motor paper feed animation with rapid printing sound (`playReceiptPrinterSound()`).
- **Parting Keigo Phrase**: Cashier delivers 「ありがとうございました！またお越しくださいませ！」.
- **Customer Farewell**: Customer replies (e.g. 「どうも！」「ごちそうさま！」) before departing.

---

## 3. TRAINING MODE VS REAL SHIFT MODE

| Feature | 研修モード (Training Mode) | 本番シフト (Real Shift Mode) |
|---|---|---|
| **Language Support** | Bengali (বাংলা) translations + Romaji | Pure Japanese audio + authentic screen text (Zero Bengali/Romaji) |
| **Keigo Explanations** | Why buttons are used, Baito Keigo grammar rules & pro-tips | No hints; relies on learner's memory & reflex |
| **Time Limits** | Unlimited time; calm stress-free learning | Active Customer Patience Meter (30s-50s) with ticking audio |
| **Consequences** | Gentle guidance on missed steps | Lost satisfaction points; customer complaints; transaction halt on wrong cash entry |
| **Shift Scorecard** | Basic feedback | Full 4-axis performance report (Scanning, Keigo, Payment, Satisfaction) + Nihomi XP |

---

## 4. DYNAMIC CUSTOMER SCENARIO ENGINE (`src/data/conbiniScenarios.ts`)

The simulator features 5 fully articulated workplace scenarios:
1. **Tanaka Salaryman (田中 健一 / 38歳 営業職)**:
   - *Items*: Karaage Bento (¥580, needs heating) + Oi Ocha Green Tea (¥160).
   - *Behavior*: Wants bento heated, declines bag, has d-Point card, pays via PayPay.
   - *Key Keigo Nuance*: Heating bento early while scanning drinks saves critical seconds.
2. **Kenji College Student (佐々木 健司 / 20歳 早稲田大学)**:
   - *Items*: Salmon Onigiri (¥180) + Karaage-kun Red (¥240) + Monster Energy (¥230).
   - *Behavior*: No heating, needs small plastic bag (+¥5), no point card, pays via Suica tap.
   - *Key Keigo Nuance*: Morning commuter greeting: 「いってらっしゃいませ！」.
3. **Yamamoto Grandma (山本 トメ / 76歳 谷中銀座の常連)**:
   - *Items*: Asahi Shimbun Newspaper (¥180) + Anpan (¥140) + Warm Green Tea Can (¥140). Total ¥460.
   - *Behavior*: Tenders ¥10,000 bill! Change calculation: ¥9,540. Cashier must count notes first, then coins on receipt.
   - *Key Keigo Nuance*: Never say 「一万円からお預かりします」 (Conbini Keigo grammar error). Always say 「一万円お預かりいたします」.
4. **Michael Foreign Tourist (マイケルさん / 28歳 訪日観光客)**:
   - *Items*: Tokyo Banana Box (¥650) + Matcha KitKat 10p (¥380) + Pocari Sweat (¥160).
   - *Behavior*: Souvenir customer, needs large bag (+¥5) so boxes lie flat, pays with Credit Card.
   - *Key Keigo Nuance*: Guiding customer to touch the Credit Card button on their own screen.
5. **Sato Office Worker Rush Hour (佐藤 課長 / 45歳 丸の内ビジネスマン)**:
   - *Items*: Beef Yakiniku Bento (¥690) + Tonjiru Miso Soup (¥150) + Sandwich (¥320) + FamiCafe Iced Coffee (¥180). Total ¥1,345.
   - *Behavior*: 12:15 PM lunch rush, wants fast 1500W heating, big bag, chopsticks & spoon, pays via Pasmo IC.
   - *Key Keigo Nuance*: Strict 30s patience meter; parallel operations required.

---

## 5. AUDIO SYNTHESIS ENGINE (ZERO-DEPENDENCY WEB AUDIO)

All sound effects are synthesized algorithmically inside `src/lib/soundEffects.ts` with zero external audio assets, ensuring 100% offline reliability:
- `playBarcodeBeep()`: 2400Hz high sine tone.
- `playConbiniChime()`: 9-note Tokyo entrance melody.
- `playMicrowaveChime()`: 2093Hz (C7) triple-beep (ピー、ピー、ピー).
- `playCashDrawerSound()`: Mechanical latch snap + metal tray slide + 1760Hz bell ding.
- `playIcCardChime()`: 1567Hz -> 2093Hz ascending transit IC confirmation (Suica "ピピッ").
- `playReceiptPrinterSound()`: 9 high-frequency micro-pulses + paper tear knife cutoff.
- `playPayPaySound()`: 880Hz -> 1318Hz cheerful upward code payment melody.
- `playCreditCardChipSound()`: Mechanical insertion click + 1046Hz approval chime.

---

## 6. VERIFICATION EVIDENCE

1. **Typecheck Verification**:
   - Command: `npx tsc --noEmit`
   - Output: `0 errors` across the entire project.
2. **Production Build**:
   - Command: `npm run build`
   - Output: Generated Prisma Client, completed Vite frontend build into `dist/`, and bundled server via esbuild into `dist/server.cjs` and `api/index.js`.
3. **Compatibility**:
   - Zero breaking changes to `BaitoOsView.tsx` or `ConbiniSimulatorModal.tsx`.
   - `onCompleteOrder` seamlessly feeds student readiness stats.
   - Neo-Tokyo responsive styling verified for desktop and mobile viewports.
