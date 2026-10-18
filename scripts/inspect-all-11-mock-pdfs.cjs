const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pdf = require('pdf-parse');

const PDF_DIR = path.join(__dirname, '..', 'content-sources', 'jlpt-mock-pdfs');
const OUTPUT_DATA = path.join(__dirname, '..', 'docs', 'nihomi-rebuild', 'mock-11-pdf-inspection-data.json');

async function inspectAllPdfs() {
  console.log('=== NIHOMI JLPT MOCK PDF 11-FILE INVENTORY PIPELINE ===');
  if (!fs.existsSync(PDF_DIR)) {
    console.error('PDF directory not found:', PDF_DIR);
    return;
  }

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} items in ${PDF_DIR}\n`);

  const results = [];
  const { PDFParse } = pdf;

  for (const filename of files) {
    const fullPath = path.join(PDF_DIR, filename);
    const stats = fs.statSync(fullPath);

    const fileBuffer = fs.readFileSync(fullPath);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    let pageCount = null;
    let textLength = 0;
    let producer = 'Unknown';
    let sampleText = '';
    let isSelectableText = false;
    let needsOcr = false;

    try {
      const uint8 = new Uint8Array(fileBuffer);
      const parser = new PDFParse(uint8);
      await parser.load();
      const info = await parser.getInfo();
      const textResult = await parser.getText();
      const text = textResult && typeof textResult === 'string' ? textResult : (textResult && textResult.text ? textResult.text : JSON.stringify(textResult || ''));
      pageCount = info ? (info.numPages || info.pages || (textResult && textResult.total) || null) : null;
      producer = info?.producer || info?.Producer || 'Unknown';
      textLength = text ? text.length : 0;
      sampleText = (text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      isSelectableText = text && text.trim().length > 100;
      needsOcr = !isSelectableText;
    } catch (err) {
      console.warn(`Warning parsing ${filename}:`, err.message);
      needsOcr = true;
    }

    const item = {
      filename,
      sizeBytes: stats.size,
      sizeKB: (stats.size / 1024).toFixed(1),
      sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
      sha256,
      pageCount,
      textLength,
      producer,
      isSelectableText,
      needsOcr,
      sampleTextPreview: sampleText
    };

    results.push(item);
    console.log(`✓ [${results.length}/11] ${filename}`);
    console.log(`   Size: ${item.sizeMB} MB | Pages: ${pageCount} | Chars: ${textLength} | Selectable: ${isSelectableText ? 'YES' : 'NO (Scanned / Needs OCR)'}`);
    console.log(`   SHA256: ${sha256.slice(0, 16)}...`);
    if (sampleText) {
      console.log(`   Preview: "${sampleText.slice(0, 70)}..."`);
    }
    console.log('');
  }

  fs.writeFileSync(OUTPUT_DATA, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nAll 11 PDFs inspected. Telemetry written to: ${OUTPUT_DATA}`);
}

inspectAllPdfs().catch(console.error);
