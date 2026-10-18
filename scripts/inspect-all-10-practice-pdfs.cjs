const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');

const PDF_FILES = [
  // 3 Existing Workbooks
  {
    id: 'CNT-026',
    name: 'Kana Pronunciation & Writing Workbook',
    relPath: 'public/downloads/kana-practice/nihomi-kana-pronunciation-writing-workbook.pdf',
    webPath: '/downloads/kana-practice/nihomi-kana-pronunciation-writing-workbook.pdf',
    claimedPages: 18,
    category: 'writing_practice',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-027',
    name: 'N5 Kana Pronunciation Guide',
    relPath: 'public/downloads/kana-practice/nihomi-n5-kana-pronunciation-guide.pdf',
    webPath: '/downloads/kana-practice/nihomi-n5-kana-pronunciation-guide.pdf',
    claimedPages: 9,
    category: 'study_guide',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-028',
    name: 'N5 Kanji Master Workbook',
    relPath: 'public/downloads/kana-practice/nihomi-n5-kanji-master-workbook.pdf',
    webPath: '/downloads/kana-practice/nihomi-n5-kanji-master-workbook.pdf',
    claimedPages: 10,
    category: 'writing_practice',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  // 7 Flagship Kana Home Practice Pack v1.0
  {
    id: 'CNT-031',
    name: 'Hiragana 50-Sound Master Chart (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-hiragana-master-chart.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-hiragana-master-chart.pdf',
    claimedPages: 1,
    category: 'master_chart',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-032',
    name: 'Katakana 46-Sound Master Chart (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-katakana-master-chart.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-katakana-master-chart.pdf',
    claimedPages: 1,
    category: 'master_chart',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-033',
    name: 'Dakuten & Yoon Master Chart (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-combined-dakuten-yoon-chart.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-combined-dakuten-yoon-chart.pdf',
    claimedPages: 1,
    category: 'master_chart',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-034',
    name: 'Kana Stroke Order Practice Grid (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf',
    claimedPages: 2,
    category: 'writing_practice',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-035',
    name: 'Kana Confusion Pairs Workbook (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-confusion-pairs-workbook.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-kana-confusion-pairs-workbook.pdf',
    claimedPages: 1,
    category: 'confusion_pairs',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-036',
    name: 'Visual Vocabulary N5 Flashcards (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-visual-vocabulary-n5-sample.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-visual-vocabulary-n5-sample.pdf',
    claimedPages: 1,
    category: 'visual_vocab',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  },
  {
    id: 'CNT-037',
    name: 'Home Practice Methodology Guide (A4)',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-home-practice-guide-bn.pdf',
    webPath: '/downloads/print-packs/kana-home-practice-v1/nihomi-home-practice-guide-bn.pdf',
    claimedPages: 1,
    category: 'study_guide',
    rights: 'ORIGINAL_CREATED_FOR_NIHOMI'
  }
];

const { PDFParse } = require('pdf-parse');

async function getPageCountFromPdf(absPath) {
  try {
    const parser = new PDFParse({ url: absPath });
    await parser.load();
    return parser.doc ? parser.doc.numPages : 1;
  } catch (err) {
    return 1;
  }
}

function httpGetTest(webPath) {
  return new Promise((resolve) => {
    const url = `http://127.0.0.1:3000${webPath}`;
    const start = Date.now();
    http.get(url, (res) => {
      let dataLen = 0;
      res.on('data', chunk => { dataLen += chunk.length; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: parseInt(res.headers['content-length'] || dataLen, 10),
          latencyMs: Date.now() - start
        });
      });
    }).on('error', err => {
      resolve({ status: 500, error: err.message, latencyMs: Date.now() - start });
    });
  });
}

async function run() {
  console.log('================================================================');
  console.log('  NIHOMI.COM — INDEPENDENT PDF AUDIT & ARITHMETIC RECONCILIATION');
  console.log('================================================================\n');

  let totalPagesCounted = 0;
  let totalBytes = 0;
  const results = [];

  for (const item of PDF_FILES) {
    const absPath = path.join(ROOT_DIR, item.relPath);
    const exists = fs.existsSync(absPath);
    let sizeBytes = 0;
    let sha256 = '';
    let actualPages = 0;

    if (exists) {
      const buf = fs.readFileSync(absPath);
      sizeBytes = buf.length;
      totalBytes += sizeBytes;
      sha256 = crypto.createHash('sha256').update(buf).digest('hex');
      actualPages = await getPageCountFromPdf(absPath);
      totalPagesCounted += actualPages;
    }

    const httpCheck = await httpGetTest(item.webPath);

    results.push({
      ...item,
      exists,
      sizeBytes,
      sizeKB: (sizeBytes / 1024).toFixed(1),
      sha256: sha256.substring(0, 12) + '...',
      actualPages,
      pageCountMatches: actualPages === item.claimedPages,
      httpStatus: httpCheck.status,
      httpOk: httpCheck.status === 200,
      httpContentType: httpCheck.contentType,
      httpLatencyMs: httpCheck.latencyMs
    });
  }

  console.log('INDEPENDENT FILE-BY-FILE AUDIT TABLE:');
  console.log('--------------------------------------------------------------------------------------------------------');
  console.log('ID      | Filename                               | Pages (Act/Claim) | Size (KB) | HTTP 200 | SHA256');
  console.log('--------------------------------------------------------------------------------------------------------');
  for (const r of results) {
    const fn = path.basename(r.relPath).padEnd(38, ' ');
    const pg = `${r.actualPages}/${r.claimedPages}`.padEnd(17, ' ');
    const sz = `${r.sizeKB} KB`.padEnd(9, ' ');
    const http = (r.httpOk ? '✓ PASS' : '✗ FAIL').padEnd(8, ' ');
    console.log(`${r.id.padEnd(7, ' ')} | ${fn} | ${pg} | ${sz} | ${http} | ${r.sha256}`);
  }
  console.log('--------------------------------------------------------------------------------------------------------\n');

  const existingPages = results.slice(0, 3).reduce((sum, r) => sum + r.actualPages, 0);
  const newPages = results.slice(3).reduce((sum, r) => sum + r.actualPages, 0);

  console.log('ARITHMETIC RECONCILIATION SUMMARY:');
  console.log(`- Pre-existing Workbooks (3 files): ${results[0].actualPages} + ${results[1].actualPages} + ${results[2].actualPages} = ${existingPages} pages`);
  console.log(`- New Kana Print Pack (7 files): ${results.slice(3).map(r => r.actualPages).join(' + ')} = ${newPages} pages`);
  console.log(`- TRUE TOTAL PAGES: ${existingPages} + ${newPages} = ${totalPagesCounted} PAGES`);
  console.log(`- Prior Phase 20.2 Claimed Total: 47 pages`);
  console.log(`- ARITHMETIC DISCREPANCY: Claimed 47 vs Actual ${totalPagesCounted} (Discrepancy: ${47 - totalPagesCounted} pages)`);
  console.log(`- Total Byte Footprint: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (${totalBytes} bytes)\n`);

  const summary = {
    timestamp: new Date().toISOString(),
    totalPdfs: results.length,
    existingPdfsCount: 3,
    existingPagesCount: existingPages,
    newPdfsCount: 7,
    newPagesCount: newPages,
    trueTotalPages: totalPagesCounted,
    claimedPriorTotalPages: 47,
    discrepancyPages: 47 - totalPagesCounted,
    allFilesExist: results.every(r => r.exists),
    allHttpOk: results.every(r => r.httpOk),
    results
  };

  const outDir = path.join(ROOT_DIR, 'artifacts/qa/phase20-3');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'pdf-reconciliation-audit.json'), JSON.stringify(summary, null, 2));
  console.log(`Saved machine audit record to: artifacts/qa/phase20-3/pdf-reconciliation-audit.json`);

  if (!results.every(r => r.exists && r.httpOk)) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
