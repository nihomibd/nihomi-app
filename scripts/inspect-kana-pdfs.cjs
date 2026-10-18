const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const candidatePdfs = [
  'Book PDF/Japanese pdf package_/Extra pdf/06_Kana_Pronunciation_Writing_Workbook.pdf',
  'Book PDF/Japanese pdf package_/Extra pdf/textbook_kana_all.pdf · version 1.pdf',
  'Book PDF/Japanese pdf package_/N5/01_N5_Kana_Pronunciation_Bangla.pdf',
  'Book PDF/Japanese pdf package_/English files/Katakana-Nihongo-Library.pdf'
];

async function inspect() {
  for (const rel of candidatePdfs) {
    const full = path.resolve(rel);
    console.log(`\n========================================`);
    console.log(`FILE: ${rel}`);
    if (!fs.existsSync(full)) {
      console.log('NOT FOUND');
      continue;
    }
    const stat = fs.statSync(full);
    console.log(`Size: ${(stat.size / 1024).toFixed(1)} KB`);
    try {
      const { PDFParse } = pdfParse;
      const uint8 = new Uint8Array(fs.readFileSync(full));
      const parser = new PDFParse(uint8);
      await parser.load();
      const info = await parser.getInfo();
      const textResult = await parser.getText();
      const text = typeof textResult === 'string' ? textResult : (textResult?.text || '');
      console.log(`Total Pages:`, info?.numPages || info?.pages || 'unknown');
      console.log(`Sample Text:\n${text.replace(/\s+/g, ' ').trim().slice(0, 300)}`);
    } catch (e) {
      console.log(`Error parsing PDF:`, e.message);
    }
  }
}

inspect();
