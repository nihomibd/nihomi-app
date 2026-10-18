// scripts/generate-kana-print-pack.cjs
// Nihomi Print Learning System — High-Fidelity A4 PDF Generator
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'downloads', 'print-packs', 'kana-home-practice-v1');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const FONT_JA = 'C:\\Windows\\Fonts\\msgothic.ttc';
const FONT_BN = 'C:\\Windows\\Fonts\\Siyamrupali.ttf';

function createDocument(title) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 30, bottom: 0, left: 35, right: 35 },
    autoFirstPage: true,
    bufferPages: true,
    info: {
      Title: title,
      Author: 'Nihomi.com',
      Subject: 'Japanese Learning & JLPT Preparation',
      Keywords: 'Japanese, Hiragana, Katakana, JLPT N5, Bengali, Nihomi',
      Creator: 'Nihomi Print Learning Engine v1.0'
    }
  });

  if (fs.existsSync(FONT_JA)) {
    doc.registerFont('Japanese', FONT_JA, 'MS-Gothic');
  }
  if (fs.existsSync(FONT_BN)) {
    doc.registerFont('Bengali', FONT_BN);
  }

  return doc;
}

function renderHeader(doc, titleEn, titleBn, subtitle) {
  const width = doc.page.width - 70;
  
  // Header background bar (Slate Dark #141726)
  doc.rect(35, 30, width, 48).fill('#141726');
  
  // Left lacquer red accent stripe
  doc.rect(35, 30, 5, 48).fill('#E45147');
  
  // Logo & Title
  doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold')
     .text('NIHOMI.COM', 48, 38, { lineBreak: false });
     
  doc.fillColor('#F6F0E6').fontSize(10.5).font('Helvetica')
     .text(titleEn, 48, 56, { lineBreak: false });
     
  if (doc._font?.name !== 'Bengali' && fs.existsSync(FONT_BN)) {
    doc.fillColor('#E2E8F0').fontSize(10).font('Bengali')
       .text(titleBn, width - 175, 46, { width: 210, align: 'right', lineBreak: false });
  }

  // Subtitle banner
  doc.rect(35, 82, width, 18).fill('#F6F0E6');
  doc.fillColor('#2F183A').fontSize(8).font('Helvetica-Bold')
     .text(subtitle, 43, 87, { lineBreak: false });

  doc.y = 108;
}

function renderFooter(doc, packName, pageNum, totalPages) {
  const width = doc.page.width - 70;
  const y = doc.page.height - 30;
  
  doc.rect(35, y, width, 0.5).fill('#CBD5E1');
  
  doc.fillColor('#64748B').fontSize(7.5).font('Helvetica')
     .text('Nihomi.com • Authentic Japanese Learning Platform', 35, y + 6, { lineBreak: false });
     
  doc.text(`${packName} • Page ${pageNum} of ${totalPages}`, doc.page.width - 245, y + 6, {
    width: 210,
    align: 'right',
    lineBreak: false
  });
}

// 1. GENERATE HIRAGANA MASTER CHART
function generateHiraganaChart() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-hiragana-master-chart.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Hiragana Master Reference Chart');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'HIRAGANA 46-SOUND MASTER REFERENCE CHART',
      'হিরাগানা পূর্ণাঙ্গ চার্ট ও উচ্চারণ',
      'GOJUON 50-SOUND GRID • ROMAJI & BENGALI PHONETIC GUIDE • LEVEL: INTRO'
    );

    // Matrix definition
    const gojuon = [
      [['あ','a','অ'], ['い','i','ই'], ['う','u','উ'], ['え','e','এ'], ['お','o','ও']],
      [['か','ka','কা'], ['き','ki','কি'], ['く','ku','কু'], ['け','ke','কে'], ['こ','ko','কো']],
      [['さ','sa','সা'], ['し','shi','শি'], ['す','su','সু'], ['せ','se','সে'], ['そ','so','সো']],
      [['た','ta','তা'], ['ち','chi','চি'], ['つ','tsu','ৎসু'], ['て','te','তে'], ['と','to','তো']],
      [['な','na','না'], ['に','ni','নি'], ['ぬ','nu','নু'], ['ね','ne','নে'], ['の','no','নো']],
      [['は','ha','হা'], ['ひ','hi','হি'], ['ふ','fu','ফু'], ['へ','he','হে'], ['ほ','ho','হো']],
      [['ま','ma','মা'], ['み','mi','মি'], ['む','mu','মু'], ['め','me','মে'], ['も','mo','মো']],
      [['や','ya','ইয়া'], ['','',''], ['ゆ','yu','ইউ'], ['','',''], ['よ','yo','ইয়ো']],
      [['ら','ra','রা'], ['り','ri','রি'], ['る','ru','রু'], ['れ','re','রে'], ['ろ','ro','রো']],
      [['わ','wa','ওয়া'], ['','',''], ['','',''], ['','',''], ['を','wo','ও/ও-আ']],
      [['ん','n','ন্/ং'], ['','',''], ['','',''], ['','',''], ['','','']]
    ];

    const cellWidth = 100;
    const cellHeight = 48;
    const startX = 35;
    let startY = 112;

    gojuon.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        const x = startX + (cIdx * (cellWidth + 6));
        const y = startY + (rIdx * (cellHeight + 4));

        if (cell[0]) {
          // Cell box
          doc.rect(x, y, cellWidth, cellHeight).fillAndStroke('#FAFAFA', '#E2E8F0');
          // Accent top border
          doc.rect(x, y, cellWidth, 2).fill('#E45147');
          
          // Japanese Glyph
          doc.fillColor('#141726').fontSize(20).font('Japanese')
             .text(cell[0], x + 8, y + 8, { lineBreak: false });
             
          // Romaji
          doc.fillColor('#E45147').fontSize(10.5).font('Helvetica-Bold')
             .text(cell[1], x + 48, y + 10, { lineBreak: false });
             
          // Bengali Sound
          doc.fillColor('#475569').fontSize(9.5).font('Bengali')
             .text(cell[2], x + 48, y + 24, { lineBreak: false });
        }
      });
    });

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 2. GENERATE KATAKANA MASTER CHART
function generateKatakanaChart() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-katakana-master-chart.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Katakana Master Reference Chart');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'KATAKANA 46-SOUND LOANWORD MASTER CHART',
      'কাতাকানা পূর্ণাঙ্গ চার্ট ও ব্যবহার',
      'FOREIGN LOANWORDS & SCIENTIFIC VOCABULARY • LEVEL: INTRO'
    );

    const gojuonKatakana = [
      [['ア','a','অ'], ['イ','i','ই'], ['ウ','u','উ'], ['エ','e','এ'], ['オ','o','ও']],
      [['カ','ka','কা'], ['キ','ki','কি'], ['ク','ku','কু'], ['ケ','ke','কে'], ['コ','ko','কো']],
      [['サ','sa','সা'], ['シ','shi','শি'], ['ス','su','সু'], ['セ','se','সে'], ['ソ','so','সো']],
      [['タ','ta','তা'], ['チ','chi','চি'], ['ツ','tsu','ৎসু'], ['テ','te','তে'], ['ト','to','তো']],
      [['ナ','na','না'], ['ニ','ni','নি'], ['ヌ','nu','নু'], ['ネ','ne','নে'], ['ノ','no','নো']],
      [['ハ','ha','হা'], ['ヒ','hi','হি'], ['フ','fu','ফু'], ['ヘ','he','হে'], ['ホ','ho','হো']],
      [['マ','ma','মা'], ['ミ','mi','মি'], ['ム','mu','মু'], ['メ','me','মে'], ['モ','mo','মো']],
      [['ヤ','ya','ইয়া'], ['','',''], ['ユ','yu','ইউ'], ['','',''], ['ヨ','yo','ইয়ো']],
      [['ラ','ra','রা'], ['リ','ri','রি'], ['ル','ru','রু'], ['レ','re','রে'], ['ロ','ro','রো']],
      [['ワ','wa','ওয়া'], ['','',''], ['','',''], ['','',''], ['ヲ','wo','ও/ও-আ']],
      [['ン','n','ন্/ং'], ['','',''], ['','',''], ['','',''], ['','','']]
    ];

    const cellWidth = 100;
    const cellHeight = 48;
    const startX = 35;
    let startY = 112;

    gojuonKatakana.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        const x = startX + (cIdx * (cellWidth + 6));
        const y = startY + (rIdx * (cellHeight + 4));

        if (cell[0]) {
          doc.rect(x, y, cellWidth, cellHeight).fillAndStroke('#FAFAFA', '#E2E8F0');
          doc.rect(x, y, cellWidth, 2).fill('#2F183A'); // Deep Plum accent
          
          doc.fillColor('#141726').fontSize(20).font('Japanese')
             .text(cell[0], x + 8, y + 8, { lineBreak: false });
             
          doc.fillColor('#2F183A').fontSize(10.5).font('Helvetica-Bold')
             .text(cell[1], x + 48, y + 10, { lineBreak: false });
             
          doc.fillColor('#475569').fontSize(9.5).font('Bengali')
             .text(cell[2], x + 48, y + 24, { lineBreak: false });
        }
      });
    });

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 3. GENERATE DAKUTEN & YOON COMBINED CHART
function generateCombinedDakutenYoonChart() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-combined-dakuten-yoon-chart.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Dakuten & Yoon Special Sound Chart');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'VOICED CONSONANTS (DAKUTEN) & CONTRACTED SOUNDS (YOON)',
      'যুক্তাক্ষর, তেনতেন (゛), মারু (゜) ও বিশেষ ধ্বনি',
      'SOUND VARIATIONS & COMBINATION GLYPHS • NIHOMI HOME REFERENCE'
    );

    // Section 1: Dakuten & Handakuten
    doc.fillColor('#141726').fontSize(10.5).font('Helvetica-Bold')
       .text('SECTION 1: DAKUTEN & HANDAKUTEN (তেনতেন ও মারু যুক্ত ধ্বনি)', 35, 112, { lineBreak: false });

    const dakuten = [
      [['が','ga','গা'], ['ぎ','gi','গি'], ['ぐ','gu','গু'], ['げ','ge','গে'], ['ご','go','গো']],
      [['ざ','za','জা'], ['じ','ji','জি'], ['ず','zu','জু'], ['ぜ','ze','জে'], ['ぞ','zo','জো']],
      [['だ','da','দা'], ['ぢ','ji','জি'], ['づ','zu','জু'], ['で','de','দে'], ['ど','do','দো']],
      [['ば','ba','বা'], ['び','bi','বি'], ['ぶ','bu','বু'], ['べ','be','বে'], ['ぼ','bo','বো']],
      [['ぱ','pa','পা'], ['ぴ','pi','পি'], ['ぷ','pu','পু'], ['ぺ','pe','পে'], ['ぽ','po','পো']]
    ];

    const cellW = 100;
    const cellH = 32;
    let currY = 128;

    dakuten.forEach(row => {
      row.forEach((cell, cIdx) => {
        const x = 35 + (cIdx * (cellW + 6));
        doc.rect(x, currY, cellW, cellH).fillAndStroke('#F8FAFC', '#E2E8F0');
        doc.fillColor('#141726').fontSize(15).font('Japanese').text(cell[0], x + 6, currY + 6, { lineBreak: false });
        doc.fillColor('#E45147').fontSize(9).font('Helvetica-Bold').text(cell[1], x + 38, currY + 6, { lineBreak: false });
        doc.fillColor('#64748B').fontSize(8.5).font('Bengali').text(cell[2], x + 38, currY + 17, { lineBreak: false });
      });
      currY += cellH + 3;
    });

    // Section 2: Yoon Contracted Sounds
    currY += 10;
    doc.fillColor('#141726').fontSize(10.5).font('Helvetica-Bold')
       .text('SECTION 2: CONTRACTED SOUNDS (YOON — ছোট ゃ ゅ ょ যুক্ত ধ্বনি)', 35, currY, { lineBreak: false });
    currY += 15;

    const yoon = [
      [['きゃ','kya','ক্যা'], ['きゅ','kyu','কিউ'], ['きょ','kyo','কিয়ো']],
      [['しゃ','sha','শা'], ['しゅ','shu','শু'], ['しょ','sho','শো']],
      [['ちゃ','cha','চা'], ['ちゅ','chu','চু'], ['ちょ','cho','চো']],
      [['にゃ','nya','নিয়া'], ['にゅ','nyu','নিউ'], ['にょ','nyo','নিয়ো']],
      [['ひゃ','hya','হিয়া'], ['ひゅ','hyu','হিউ'], ['ひょ','hyo','হিয়ো']],
      [['みゃ','mya','মিয়া'], ['みゅ','myu','মিউ'], ['みょ','myo','মিয়ো']],
      [['りゃ','rya','রিয়া'], ['りゅ','ryu','রিউ'], ['りょ','ryo','রিয়ো']],
      [['ぎゃ','gya','গ্যা'], ['ぎゅ','gyu','গিউ'], ['ぎょ','gyo','গিয়ো']],
      [['じゃ','ja','জা'], ['じゅ','ju','জু'], ['じょ','jo','জো']],
      [['びゃ','bya','ব্যা'], ['びゅ','byu','বিউ'], ['びょ','byo','বিয়ো']],
      [['ぴゃ','pya','প্যা'], ['ぴゅ','pyu','পিউ'], ['ぴょ','pyo','পিয়ো']]
    ];

    const yCellW = 170;
    const yCellH = 24;

    yoon.slice(0, 11).forEach(row => {
      row.forEach((cell, cIdx) => {
        const x = 35 + (cIdx * (yCellW + 8));
        doc.rect(x, currY, yCellW, yCellH).fillAndStroke('#FFFFFF', '#E2E8F0');
        doc.fillColor('#141726').fontSize(13).font('Japanese').text(cell[0], x + 6, currY + 4, { lineBreak: false });
        doc.fillColor('#2F183A').fontSize(9).font('Helvetica-Bold').text(cell[1], x + 50, currY + 5, { lineBreak: false });
        doc.fillColor('#64748B').fontSize(8.5).font('Bengali').text(cell[2], x + 105, currY + 5, { lineBreak: false });
      });
      currY += yCellH + 2;
    });

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 4. GENERATE KANA STROKE ORDER WRITING PRACTICE (Exactly 2 Pages)
function generateStrokeWritingPractice() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-kana-stroke-order-practice.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Kana Handwriting & Stroke Order Practice');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const pagesData = [
      {
        pageTitle: 'HIRAGANA VOWEL & KA-LINE STROKE PRACTICE',
        pageBn: 'হিরাগানা স্বরবর্ণ ও কা-লাইন হাত ঘোরানো অনুশীলন',
        chars: [
          { char: 'あ', romaji: 'a', strokes: 3, bn: 'অ / আ', tip: '১ম দাগ বাম থেকে ডানে, ২য় উল্লম্ব, ৩য় বৃত্তাকার লুপ।' },
          { char: 'い', romaji: 'i', strokes: 2, bn: 'ই', tip: '১ম দাগে নিচে বাঁকানো হুক, ২য় দাগ সোজা ছোট।' },
          { char: 'う', romaji: 'u', strokes: 2, bn: 'উ', tip: '১ম দাগ ছোট বিন্দু ডানে বাঁকা, ২য় দাগ বড় অর্ধবৃত্ত।' },
          { char: 'え', romaji: 'e', strokes: 2, bn: 'এ', tip: '১ম দাগ ছোট তির্যক, ২য় দাগ Z-আকৃতি হয়ে নিচে ঢেউ।' },
          { char: 'お', romaji: 'o', strokes: 3, bn: 'ও', tip: '১ম আনুভূমিক, ২য় উল্লম্ব লুপ, ৩য় ডানদিকের ছোট ফোঁটা।' },
          { char: 'か', romaji: 'ka', strokes: 3, bn: 'কা', tip: '১ম বাঁকানো হুক, ২য় ভেদ করা রেখা, ৩য় ডানদিকের টান।' },
          { char: 'き', romaji: 'ki', strokes: 4, bn: 'কি', tip: 'দুটি আনুভূমিক রেখা, একটি তির্যক এবং নিচে বিচ্ছিন্ন বৃত্তচাপ।' }
        ]
      },
      {
        pageTitle: 'HIRAGANA SA, TA & NA LINE PRACTICE',
        pageBn: 'সা, তা ও না লাইন হাত ঘোরানো ও স্বতঃস্ফূর্ত অনুশীলন',
        chars: [
          { char: 'さ', romaji: 'sa', strokes: 3, bn: 'সা', tip: '১ম আনুভূমিক, ২য় নিচের দিকে বাঁকা, ৩য় নিচের বিচ্ছিন্ন বৃত্তচাপ।' },
          { char: 'し', romaji: 'shi', strokes: 1, bn: 'শি', tip: 'এক টানে মাছ ধরার বড়শির মতো নিচে গিয়ে ডানে বাঁকা।' },
          { char: 'す', romaji: 'su', strokes: 2, bn: 'সু', tip: '১ম আনুভূমিক, ২য় নিচে নেমে মাঝে বৃত্তাকার লুপ দিয়ে নিচে।' },
          { char: 'た', romaji: 'ta', strokes: 4, bn: 'তা', tip: '১ম আনুভূমিক, ২য় তির্যক, ডানে ছোট こ এর মতো অংশ।' },
          { char: 'ち', romaji: 'chi', strokes: 2, bn: 'চি', tip: '১ম আনুভূমিক, ২য় নিচে গিয়ে ডানদিকে পূর্ণ অর্ধবৃত্ত।' },
          { char: 'つ', romaji: 'tsu', strokes: 1, bn: 'ৎসু', tip: 'এক টানে ডানে গিয়ে নিচে ধনুকের মতো বৃত্তাকার।' },
          { char: 'な', romaji: 'na', strokes: 4, bn: 'না', tip: '১ম আনুভূমিক, ২য় তির্যক, ৩য় ছোট ফোঁটা, ৪র্থ লুপ।' }
        ]
      }
    ];

    pagesData.forEach((pData, pIdx) => {
      if (pIdx > 0) doc.addPage();

      renderHeader(
        doc,
        pData.pageTitle,
        pData.pageBn,
        'STROKE ORDER NUMBERS • TRACE BOXES • MEMORY WRITING • SELF-CHECK'
      );

      let rowY = 112;
      const rowHeight = 78;

      pData.chars.forEach(item => {
        // Master Char Box
        doc.rect(35, rowY, 68, rowHeight - 6).fillAndStroke('#F1F5F9', '#CBD5E1');
        doc.fillColor('#141726').fontSize(32).font('Japanese').text(item.char, 48, rowY + 10, { lineBreak: false });
        doc.fillColor('#E45147').fontSize(9.5).font('Helvetica-Bold').text(`${item.romaji} (${item.strokes} str)`, 40, rowY + 50, { lineBreak: false });

        // Practice Grid (4 boxes: 2 Trace, 2 Blank)
        for (let b = 0; b < 4; b++) {
          const bx = 112 + (b * 66);
          const by = rowY;
          doc.rect(bx, by, 60, rowHeight - 6).fillAndStroke('#FFFFFF', '#94A3B8');
          
          // Center dashed guidelines
          doc.dash(3, { space: 3 });
          doc.moveTo(bx + 30, by).lineTo(bx + 30, by + rowHeight - 6).stroke('#CBD5E1');
          doc.moveTo(bx, by + (rowHeight - 6) / 2).lineTo(bx + 60, by + (rowHeight - 6) / 2).stroke('#CBD5E1');
          doc.undash();

          if (b < 2) {
            // Light gray trace guide
            doc.fillColor('#CBD5E1').fontSize(30).font('Japanese').text(item.char, bx + 15, by + 12, { lineBreak: false });
          }
        }

        // Instructions & Self Check box
        const checkX = 385;
        doc.rect(checkX, rowY, 175, rowHeight - 6).fillAndStroke('#FAFAFA', '#E2E8F0');
        doc.fillColor('#1E293B').fontSize(8.5).font('Bengali').text(item.tip, checkX + 6, rowY + 6, { width: 160, lineBreak: true });
        doc.rect(checkX + 145, rowY + 48, 16, 16).stroke('#94A3B8');
        doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('Self-Check ✓', checkX + 85, rowY + 52, { lineBreak: false });

        rowY += rowHeight;
      });

      renderFooter(doc, 'Kana Home Practice Pack v1.0', pIdx + 1, pagesData.length);
    });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 5. GENERATE KANA CONFUSION PAIRS WORKBOOK
function generateConfusionPairsWorkbook() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-kana-confusion-pairs-workbook.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Kana Confusion-Pairs Practice Workbook');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'KANA CONFUSION-PAIR DISCRIMINATION WORKBOOK',
      'সাদৃশ্যপূর্ণ অক্ষরের বিভ্রান্তি দূরীকরণ ও সঠিক অনুশীলন',
      'CONTRASTIVE STROKE ANALYSIS • SIDE-BY-SIDE REPETITION CELL GRID'
    );

    const pairs = [
      {
        pairName: 'PAIR 1: さ (sa) vs ち (chi)',
        diffBn: 'さ এর মুখ ডানদিকে বাঁকা, আনুভূমিক রেখা ১টি। ち এর মুখ বামদিকে বাঁকা, উল্টো ২-এর মতো।',
        left: { char: 'さ', romaji: 'sa', soundBn: 'সা' },
        right: { char: 'ち', romaji: 'chi', soundBn: 'চি' }
      },
      {
        pairName: 'PAIR 2: れ (re) vs わ (wa) vs ね (ne)',
        diffBn: 'れ এর শেষ প্রান্ত বাইরে বাঁকানো। わ এর শেষ প্রান্ত মসৃণ গোলাকার। ね এর শেষ প্রান্তে গোল লুপ/গিঁট রয়েছে।',
        left: { char: 'れ', romaji: 're', soundBn: 'রে' },
        right: { char: 'わ', romaji: 'wa', soundBn: 'ওয়া' }
      },
      {
        pairName: 'PAIR 3: シ (shi) vs ツ (tsu) [KATAKANA]',
        diffBn: 'シ (shi) এর দাগগুলো নিচ থেকে উপরের দিকে যায়। ツ (tsu) এর দাগগুলো উপর থেকে নিচে সোজা নামে।',
        left: { char: 'シ', romaji: 'shi', soundBn: 'শি' },
        right: { char: 'ツ', romaji: 'tsu', soundBn: 'ৎসু' }
      },
      {
        pairName: 'PAIR 4: ソ (so) vs ン (n) [KATAKANA]',
        diffBn: 'ソ (so) উপর থেকে নিচে খাঁড়াভাবে নামে। ン (n) নিচ থেকে বাম-ডানে তির্যকভাবে টানা হয়।',
        left: { char: 'ソ', romaji: 'so', soundBn: 'সো' },
        right: { char: 'ン', romaji: 'n', soundBn: 'ন্/ং' }
      }
    ];

    let startY = 112;
    pairs.forEach(p => {
      // Pair Banner
      doc.rect(35, startY, 525, 18).fill('#2F183A');
      doc.fillColor('#FFFFFF').fontSize(9.5).font('Helvetica-Bold').text(p.pairName, 45, startY + 4, { lineBreak: false });
      startY += 21;

      // Explanation Box
      doc.rect(35, startY, 525, 26).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.fillColor('#334155').fontSize(8.5).font('Bengali').text(p.diffBn, 45, startY + 6, { width: 505, lineBreak: true });
      startY += 30;

      // Practice Rows for Left & Right
      [p.left, p.right].forEach(item => {
        doc.rect(35, startY, 68, 36).fillAndStroke('#F1F5F9', '#CBD5E1');
        doc.fillColor('#141726').fontSize(18).font('Japanese').text(item.char, 45, startY + 5, { lineBreak: false });
        doc.fillColor('#E45147').fontSize(8.5).font('Helvetica-Bold').text(item.romaji, 78, startY + 10, { lineBreak: false });
        
        for (let c = 0; c < 6; c++) {
          const cx = 110 + (c * 75);
          doc.rect(cx, startY, 68, 36).stroke('#94A3B8');
          if (c < 2) {
            doc.fillColor('#CBD5E1').fontSize(18).font('Japanese').text(item.char, cx + 22, startY + 6, { lineBreak: false });
          }
        }
        startY += 40;
      });

      startY += 8;
    });

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 6. GENERATE VISUAL VOCABULARY MINI-PACK (N5 SAMPLE)
function generateVisualVocabularyMiniPack() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-visual-vocabulary-n5-sample.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi N5 Visual Vocabulary Mini-Pack');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'JLPT N5 VISUAL VOCABULARY FLASH-WORKBOOK',
      'চিত্রসহ শব্দভাণ্ডার ও বাস্তব উদাহরণ বাক্য',
      'VISUAL MEMORY ANCHORS • KANJI • FURIGANA • BENGALI MEANING'
    );

    const vocabList = [
      { ja: 'しろ', kanji: '白', romaji: 'shiro', bn: 'সাদা রং', exJa: 'しろいくるま', exBn: 'সাদা গাড়ি' },
      { ja: 'あめ', kanji: '雨', romaji: 'ame', bn: 'বৃষ্টি (আকাশের পানি)', exJa: 'あめがふります', exBn: 'বৃষ্টি পড়ছে' },
      { ja: 'いぬ', kanji: '犬', romaji: 'inu', bn: 'কুকুর', exJa: 'かわいいいぬ', exBn: 'মিষ্টি কুকুর' },
      { ja: 'えき', kanji: '駅', romaji: 'eki', bn: 'রেলস্টেশন', exJa: 'とうきょうえき', exBn: 'টোকিও স্টেশন' },
      { ja: 'やま', kanji: '山', romaji: 'yama', bn: 'পাহাড় / পর্বত', exJa: 'ふじさん', exBn: 'ফুজি পর্বত' },
      { ja: 'かわ', kanji: '川', romaji: 'kawa', bn: 'নদী', exJa: 'ひろいかわ', exBn: 'প্রশস্ত নদী' },
      { ja: 'ほん', kanji: '本', romaji: 'hon', bn: 'বই', exJa: 'にほんごのほん', exBn: 'জাপানি ভাষার বই' },
      { ja: 'ひと', kanji: '人', romaji: 'hito', bn: 'মানুষ', exJa: 'いいひと', exBn: 'ভালো মানুষ' },
      { ja: 'みず', kanji: '水', romaji: 'mizu', bn: 'পানি (পানীয় জল)', exJa: 'つめたいみず', exBn: 'ঠান্ডা পানি' },
      { ja: 'ひ', kanji: '火', romaji: 'hi', bn: 'আগুন', exJa: 'ひをつける', exBn: 'আগুন জ্বালানো' }
    ];

    let currY = 112;
    const cardW = 255;
    const cardH = 88;

    for (let i = 0; i < vocabList.length; i += 2) {
      const rowItems = [vocabList[i], vocabList[i + 1]];
      rowItems.forEach((v, col) => {
        if (!v) return;
        const x = 35 + (col * (cardW + 15));

        // Card Border & Background
        doc.rect(x, currY, cardW, cardH).fillAndStroke('#FFFFFF', '#CBD5E1');
        doc.rect(x, currY, cardW, 3).fill('#E45147');

        // Japanese & Kanji
        doc.fillColor('#141726').fontSize(24).font('Japanese').text(v.kanji, x + 10, currY + 10, { lineBreak: false });
        doc.fillColor('#E45147').fontSize(12).font('Japanese').text(v.ja, x + 55, currY + 12, { lineBreak: false });
        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text(v.romaji, x + 55, currY + 28, { lineBreak: false });

        // Bengali Meaning
        doc.fillColor('#1E293B').fontSize(9.5).font('Bengali').text(v.bn, x + 130, currY + 14, { width: 115, lineBreak: false });

        // Divider
        doc.rect(x + 10, currY + 44, cardW - 20, 0.5).fill('#E2E8F0');

        // Example Sentence
        doc.fillColor('#475569').fontSize(9.5).font('Japanese').text(`例: ${v.exJa}`, x + 10, currY + 50, { lineBreak: false });
        doc.fillColor('#64748B').fontSize(8.5).font('Bengali').text(`অর্থ: ${v.exBn}`, x + 10, currY + 68, { lineBreak: false });
      });

      currY += cardH + 10;
    }

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// 7. GENERATE HOME PRACTICE METHODOLOGY GUIDE
function generateHomePracticeGuide() {
  return new Promise((resolve, reject) => {
    const filename = 'nihomi-home-practice-guide-bn.pdf';
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = createDocument('Nihomi Home Practice Methodology Guide');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    renderHeader(
      doc,
      'HOME PRACTICE METHODOLOGY & EFFECTIVE STUDY GUIDE',
      'বাসায় সঠিক পদ্ধতিতে জাপানি অনুশীলনের ৫টি ধাপ',
      'PEDAGOGICALLY PROVEN KINÆSTHETIC LEARNING CYCLE • NIHOMI CONSTITUTION'
    );

    const steps = [
      {
        num: 'ধাপ ১',
        title: '১০০% স্কেলে প্রিন্ট ও বসার স্থান নির্ধারণ',
        desc: 'A4 কাগজে প্রিন্ট দেওয়ার সময় "Fit to Printable Area" বা স্কেলিং ১০০% নিশ্চিত করুন। পর্যাপ্ত আলো এবং আরামদায়ক টেবিল-চেয়ারে বসুন।'
      },
      {
        num: 'ধাপ ২',
        title: 'অডিও শুনে স্পষ্ট উচ্চারণ (Listen & Vocalize)',
        desc: 'Nihomi অ্যাপে সংশ্লিষ্ট অক্ষরের সঠিক অডিও শুনুন এবং মুখে উচ্চারণ করুন। কান ও মুখের সমন্বয়ে মস্তিষ্কের অডিটরি মেমোরি তৈরি হয়।'
      },
      {
        num: 'ধাপ ৩',
        title: 'স্ট্রোকের দিক ও সংখ্যার নির্ভুল ট্রেসিং (Trace)',
        desc: 'প্রথম দুই বক্সে পেন্সিল দিয়ে হালকা দাগের উপর হাত ঘোরান। ১, ২, ৩ ক্রমিক নম্বর ও তীরের দিক পুঙ্খানুপুঙ্খভাবে মেনে চলুন।'
      },
      {
        num: 'ধাপ ৪',
        title: 'স্মৃতি থেকে আত্মবিশ্বাসের সাথে লেখা (Active Recall)',
        desc: 'পরের ৩টি ফাঁকা বক্সে কোনো সাহায্য ছাড়া নিজে লিখুন। ভুল হলে রাবার দিয়ে মুছে আবার চেষ্টা করুন। কোনো তাড়াহুড়ো করবেন না।'
      },
      {
        num: 'ধাপ ৫',
        title: 'স্বমূল্যায়ন ও নমি সেন্সেই ফিডব্যাক (Self-Check)',
        desc: 'লেখা শেষে ডানপাশের চেকবক্সে টিক দিন। অ্যাপে ফিরে এসে ইন্টারেক্টিভ ক্যানভাসে যাচাই করে আপনার স্ট্রিক ও এক্সপি আনলক করুন।'
      }
    ];

    let startY = 112;
    steps.forEach((s) => {
      // Step number pill
      doc.rect(35, startY, 65, 22).fill('#E45147');
      doc.fillColor('#FFFFFF').fontSize(10).font('Bengali').text(s.num, 42, startY + 4, { lineBreak: false });

      // Step title
      doc.fillColor('#141726').fontSize(11).font('Bengali').text(s.title, 110, startY + 4, { lineBreak: false });
      
      // Step description box
      doc.rect(35, startY + 26, 525, 42).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.fillColor('#334155').fontSize(9).font('Bengali').text(s.desc, 45, startY + 32, { width: 505, lineBreak: true });

      startY += 76;
    });

    // Golden tip box
    doc.rect(35, startY + 6, 525, 48).fill('#F6F0E6');
    doc.rect(35, startY + 6, 6, 48).fill('#6D7C55'); // Moss Green
    doc.fillColor('#141726').fontSize(10).font('Bengali').text('নমি সেন্সেই-এর গোল্ডেন টিপ (Sensei Advice):', 50, startY + 12, { lineBreak: false });
    doc.fillColor('#475569').fontSize(8.5).font('Bengali').text(
      'একদিনে সব মুখস্থ করার চেষ্টা না করে প্রতিদিন ১৫ মিনিট নিয়ম করে লিখুন। ভুল হওয়া শিখার স্বাভাবিক অংশ; ভুল দেখেই মস্তিষ্ক সবচেয়ে দ্রুত শেখে।',
      50, startY + 28, { width: 500, lineBreak: true }
    );

    renderFooter(doc, 'Kana Home Practice Pack v1.0', 1, 1);
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// MAIN RUNNER
async function run() {
  console.log('Generating Flagship Kana Home Practice Pack v1.0...');
  const generators = [
    generateHiraganaChart,
    generateKatakanaChart,
    generateCombinedDakutenYoonChart,
    generateStrokeWritingPractice,
    generateConfusionPairsWorkbook,
    generateVisualVocabularyMiniPack,
    generateHomePracticeGuide
  ];

  for (const gen of generators) {
    const file = await gen();
    const stats = fs.statSync(file);
    console.log(`✓ Generated: ${path.basename(file)} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
  console.log('All 7 PDF print assets successfully generated!');
}

run().catch(console.error);
