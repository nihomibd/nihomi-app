const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const MOCK_DIR = path.join(__dirname, '..', 'content-sources', 'jlpt-mock-pdfs');

async function inspectPdfs() {
  console.log('================================================================');
  console.log('🔍 NIHOMI JLPT MOCK TEST PDF SOURCE INSPECTION');
  console.log('================================================================');
  console.log(`Directory: ${MOCK_DIR}\n`);

  if (!fs.existsSync(MOCK_DIR)) {
    console.error(`Directory not found: ${MOCK_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MOCK_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files.\n`);

  const results = [];

  for (const file of files) {
    const fullPath = path.join(MOCK_DIR, file);
    const stats = fs.statSync(fullPath);
    const buffer = fs.readFileSync(fullPath);

    try {
      const { PDFParse } = pdf;
      const uint8 = new Uint8Array(buffer);
      const parser = new PDFParse(uint8);
      await parser.load();
      const info = await parser.getInfo();
      const textResult = await parser.getText();
      const text = textResult && typeof textResult === 'string' ? textResult : (textResult && textResult.text ? textResult.text : JSON.stringify(textResult || ''));
      const numPages = info ? (info.numPages || info.pages || (textResult && textResult.total) || null) : null;
      const isExtractable = text && text.trim().length > 100;
      const sampleText = (text || '').replace(/\s+/g, ' ').trim().slice(0, 160);

      results.push({
        filename: file,
        sizeBytes: stats.size,
        sizeKb: (stats.size / 1024).toFixed(1) + ' KB',
        numPages: numPages || (info ? info.pagesCount : null),
        info,
        isExtractable,
        textLength: (text || '').length,
        sampleText
      });

      console.log(`📄 [${file}]`);
      console.log(`   - Size: ${(stats.size / 1024).toFixed(1)} KB`);
      console.log(`   - Pages: ${numPages || (info ? info.pagesCount : 'N/A')}`);
      console.log(`   - Extractable: ${isExtractable ? 'YES (Text-based PDF)' : 'NO (Scanned / Image)'}`);
      console.log(`   - Text Length: ${(text || '').length} chars`);
      console.log(`   - Preview: "${sampleText.slice(0, 80)}..."\n`);
    } catch (err) {
      console.error(`❌ Error parsing ${file}:`, err.message);
      results.push({
        filename: file,
        sizeBytes: stats.size,
        error: err.message
      });
    }
  }

  const outPath = path.join(__dirname, '..', 'docs', 'nihomi-rebuild', 'mock-pdf-inspection-data.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`✔ Inspection results saved to: ${outPath}`);
}

inspectPdfs().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});
