// scripts/setup-phase19-practice-sheets.cjs
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STAGING_DIR = path.resolve('artifacts/staging/phase19-practice-sheets');
const PUBLIC_DIR = path.resolve('public/downloads/kana-practice');

const SOURCES = [
  {
    key: 'hiragana_practice_sheet',
    titleBn: 'হিরাগানা লেখার অনুশীলন শিট (Hiragana Grid Tracing & Writing Sheet)',
    descBn: '৪৬টি মৌলিক হিরাগানা অক্ষরের স্ট্রোকের দিকনির্দেশনা, ট্রেসিং লাইন ও স্বয়ংসম্পূর্ণ প্র্যাকটিস গ্রিড।',
    pages: 15,
    sourceRel: 'Book PDF/Japanese pdf package_/English files/Hiragana-Nihongo-Library.pdf',
    targetName: 'nihomi-hiragana-writing-practice-sheet.pdf'
  },
  {
    key: 'katakana_practice_sheet',
    titleBn: 'কাতাকানা লেখার অনুশীলন শিট (Katakana Grid Tracing & Writing Sheet)',
    descBn: '৪৬টি কাতাকানা অক্ষরের স্পষ্ট স্ট্রোক অর্ডার, শুরু ও শেষের বিন্দু এবং প্র্যাকটিস বক্স।',
    pages: 23,
    sourceRel: 'Book PDF/Japanese pdf package_/English files/Katakana-Nihongo-Library.pdf',
    targetName: 'nihomi-katakana-writing-practice-sheet.pdf'
  },
  {
    key: 'kana_writing_workbook',
    titleBn: 'নিহোমি কানা ও উচ্চারণ প্র্যাকটিস ওয়ার্কবুক (Foundational Workbook)',
    descBn: 'হিরাগানা, কাতাকানা, যুক্তাক্ষর, তেনতেন/মারু এবং বাংলা উচ্চারণ নির্দেশিকা সহ ১৮ পৃষ্ঠার পূর্ণাঙ্গ ওয়ার্কবুক।',
    pages: 18,
    sourceRel: 'Book PDF/Japanese pdf package_/Extra pdf/06_Kana_Pronunciation_Writing_Workbook.pdf',
    targetName: 'nihomi-kana-pronunciation-writing-workbook.pdf'
  },
  {
    key: 'combined_kana_worksheets',
    titleBn: 'কম্বাইন্ড হিরাগানা ও কাতাকানা ড্রিল বুক (Comprehensive MLC Worksheets)',
    descBn: 'হিরাগানা ও কাতাকানা কুইজ, রিডিং টেস্ট ও শব্দভাণ্ডার গঠনের ২৩ পৃষ্ঠার কম্বাইন্ড শিট।',
    pages: 23,
    sourceRel: 'Book PDF/Japanese pdf package_/English files/16.-Hiragana-and-Katakana-Worksheets-author-Meguro-Language-Center.pdf',
    targetName: 'nihomi-combined-kana-worksheets.pdf'
  }
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function setup() {
  console.log('=== SETTING UP PHASE 19 PRACTICE SHEETS ===');
  if (!fs.existsSync(STAGING_DIR)) fs.mkdirSync(STAGING_DIR, { recursive: true });
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const inventory = [];

  for (const item of SOURCES) {
    const srcPath = path.resolve(item.sourceRel);
    if (!fs.existsSync(srcPath)) {
      console.error(`[ERROR] Missing source file: ${srcPath}`);
      continue;
    }

    const stat = fs.statSync(srcPath);
    const hash = sha256File(srcPath);
    const sizeKB = (stat.size / 1024).toFixed(1);

    const stagingPath = path.join(STAGING_DIR, item.targetName);
    const publicPath = path.join(PUBLIC_DIR, item.targetName);

    fs.copyFileSync(srcPath, stagingPath);
    fs.copyFileSync(srcPath, publicPath);

    console.log(`[OK] Copied ${item.targetName} (${sizeKB} KB, ${item.pages} pages)`);

    inventory.push({
      key: item.key,
      titleBn: item.titleBn,
      descBn: item.descBn,
      filename: item.targetName,
      publicUrl: `/downloads/kana-practice/${item.targetName}`,
      fileSizeBytes: stat.size,
      fileSizeKB: parseFloat(sizeKB),
      pages: item.pages,
      sha256: hash,
      sourceOriginal: item.sourceRel
    });
  }

  const inventoryPath = path.join(STAGING_DIR, 'inventory.json');
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2), 'utf-8');
  console.log(`Inventory written to: ${inventoryPath}`);

  // Also write to src/data/practiceSheetsData.ts for React consumption
  const tsContent = `// src/data/practiceSheetsData.ts
// Auto-generated Nihomi Practice Sheet Asset Inventory

export interface PracticeSheetAsset {
  key: string;
  titleBn: string;
  descBn: string;
  filename: string;
  publicUrl: string;
  fileSizeKB: number;
  pages: number;
  sha256: string;
}

export const CANONICAL_PRACTICE_SHEETS: PracticeSheetAsset[] = ${JSON.stringify(inventory, null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/practiceSheetsData.ts'), tsContent, 'utf-8');
  console.log('src/data/practiceSheetsData.ts generated successfully.');
}

setup();
