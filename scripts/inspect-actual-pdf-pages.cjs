// scripts/inspect-actual-pdf-pages.cjs
// Nihomi Phase 22.3 — Authoritative PDF Page-Count and Header Verification
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const ROOT_DIR = path.resolve(__dirname, '..');

const CANONICAL_FILES = [
  {
    key: 'hiragana_master_chart',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-hiragana-master-chart.pdf'
  },
  {
    key: 'katakana_master_chart',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-katakana-master-chart.pdf'
  },
  {
    key: 'combined_dakuten_yoon_chart',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-combined-dakuten-yoon-chart.pdf'
  },
  {
    key: 'kana_stroke_order_practice',
    expectedPages: 2,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf'
  },
  {
    key: 'kana_confusion_pairs',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-confusion-pairs-workbook.pdf'
  },
  {
    key: 'visual_vocab_n5_sample',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-visual-vocabulary-n5-sample.pdf'
  },
  {
    key: 'home_practice_guide_bn',
    expectedPages: 1,
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-home-practice-guide-bn.pdf'
  },
  {
    key: 'kana_writing_workbook',
    expectedPages: 18,
    relPath: 'public/downloads/kana-practice/nihomi-kana-pronunciation-writing-workbook.pdf'
  },
  {
    key: 'n5_kana_script_guide',
    expectedPages: 9,
    relPath: 'public/downloads/kana-practice/nihomi-n5-kana-pronunciation-guide.pdf'
  },
  {
    key: 'n5_kanji_master_sheet',
    expectedPages: 10,
    relPath: 'public/downloads/kana-practice/nihomi-n5-kanji-master-workbook.pdf'
  }
];

async function run() {
  console.log('=== NIHOMI CANONICAL PRACTICE PDF AUDIT ===\n');
  let totalActualPages = 0;
  let totalDeclaredPages = 0;
  let allHeadersValid = true;
  let allFilesExist = true;
  let allPageCountsMatch = true;
  const results = [];

  for (const item of CANONICAL_FILES) {
    const fullPath = path.join(ROOT_DIR, item.relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`[FAIL] File missing: ${item.relPath}`);
      allFilesExist = false;
      continue;
    }

    const dataBuffer = fs.readFileSync(fullPath);
    const header = dataBuffer.slice(0, 5).toString('ascii');
    const isPdfHeader = header.startsWith('%PDF-');
    if (!isPdfHeader) allHeadersValid = false;

    let parsedPages = 0;
    try {
      const parser = new PDFParse({ data: dataBuffer });
      const info = await parser.getInfo();
      parsedPages = info.total;
      await parser.destroy();
    } catch (e) {
      console.error(`Error parsing ${item.relPath}:`, e.message);
    }

    totalActualPages += parsedPages;
    totalDeclaredPages += item.expectedPages;

    const matchesExpected = parsedPages === item.expectedPages;
    if (!matchesExpected) allPageCountsMatch = false;

    results.push({
      key: item.key,
      relPath: item.relPath,
      filename: path.basename(item.relPath),
      fileSizeBytes: dataBuffer.length,
      fileSizeKB: parseFloat((dataBuffer.length / 1024).toFixed(1)),
      header: header,
      isPdfHeader: isPdfHeader,
      expectedPages: item.expectedPages,
      actualPages: parsedPages,
      matchesExpected: matchesExpected
    });

    console.log(`[${matchesExpected ? 'PASS' : 'FAIL'}] ${path.basename(item.relPath).padEnd(46)} | Pages: ${String(parsedPages).padStart(2)} / ${String(item.expectedPages).padStart(2)} | Size: ${(dataBuffer.length/1024).toFixed(1).padStart(5)} KB | Header: ${header}`);
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total PDF Files:            ${results.length} / 10`);
  console.log(`All Files Exist:            ${allFilesExist ? 'PASS' : 'FAIL'}`);
  console.log(`All Headers Valid (%PDF-):  ${allHeadersValid ? 'PASS' : 'FAIL'}`);
  console.log(`All Page Counts Match:      ${allPageCountsMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Total Declared Pages:       ${totalDeclaredPages}`);
  console.log(`Total Actual Parsed Pages:  ${totalActualPages}`);

  const outputDir = path.join(ROOT_DIR, 'artifacts', 'qa', 'phase22-3-release-truth');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const manifestPath = path.join(outputDir, 'pdf-page-count-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    allFilesExist,
    allHeadersValid,
    allPageCountsMatch,
    totalActualPages,
    totalDeclaredPages,
    files: results
  }, null, 2), 'utf8');

  console.log(`\nAuthoritative manifest written to:\n${manifestPath}`);
  
  if (!allFilesExist || !allHeadersValid || !allPageCountsMatch) {
    console.error('\nPDF AUDIT FAILED.');
    process.exit(1);
  }
  console.log('\nPDF AUDIT COMPLETED WITH 100% PASS.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
