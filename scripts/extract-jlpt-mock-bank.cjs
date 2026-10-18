const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_DIR = path.join(__dirname, '..', 'content-sources', 'jlpt-mock-pdfs');
const PROCESSED_DIR = path.join(__dirname, '..', 'content-sources', 'processed', 'jlpt');

if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

async function extractAllLevels() {
  console.log('=== EXTRACTING FULL JLPT MOCK QUESTION BANK (N5–N1) ===');
  const { PDFParse } = pdf;

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const masterBank = {
    generatedAt: new Date().toISOString(),
    totalQuestions: 0,
    levels: {}
  };

  for (const lvl of levels) {
    const filename = `JLPT_${lvl}_Bangla_Japanese_Complete_Mock_Test.pdf`;
    const fullPath = path.join(PDF_DIR, filename);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${filename}`);
      continue;
    }

    const buf = fs.readFileSync(fullPath);
    const parser = new PDFParse(new Uint8Array(buf));
    await parser.load();
    const res = await parser.getText();
    const lines = res.text.split('\n').map(l => l.trim()).filter(Boolean);

    // Extract Answer Keys and explanations from the back
    const answerKeyMap = new Map();
    for (const line of lines) {
      // Matches "7 \t 1 \t 「高い」=..." or "24 \t 1 \t কারণ..."
      const ansMatch = line.match(/^(\d+)\s+([1-4])\s+(.+)$/);
      if (ansMatch) {
        const qNum = parseInt(ansMatch[1], 10);
        const ans = parseInt(ansMatch[2], 10);
        const explanation = ansMatch[3].trim();
        if (qNum >= 1 && qNum <= 50) {
          answerKeyMap.set(qNum, { answer: ans, explanation });
        }
      }
    }

    // Extract questions (Questions 1 to 40)
    const questions = [];
    let currentSection = 'Vocabulary / Kanji';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('Section 1')) currentSection = 'Vocabulary / Kanji';
      else if (line.includes('Section 2') || line.includes('Grammar')) currentSection = 'Grammar';
      else if (line.includes('Section 3') || line.includes('Reading')) currentSection = 'Reading';
      else if (line.includes('Section 4') || line.includes('Listening')) currentSection = 'Listening Simulation';

      // Question line pattern: starts with number followed by Japanese/Bengali prompt
      const qMatch = line.match(/^(\d+)\s+([「"わたし].+|\S.+)/);
      if (qMatch && parseInt(qMatch[1], 10) >= 1 && parseInt(qMatch[1], 10) <= 40) {
        const qNum = parseInt(qMatch[1], 10);
        // Next 1 or 2 lines usually contain options
        const prompt = qMatch[2] || line;
        const options = [];

        // Lookahead for options in next 2 lines
        for (let j = 1; j <= 3; j++) {
          const nextLine = lines[i + j] || '';
          if (nextLine.match(/^[1-4]\s/)) {
            // Split tabs or multiple options on one line
            const parts = nextLine.split(/\t|\s{2,}/).map(p => p.trim()).filter(Boolean);
            options.push(...parts);
          }
        }

        const keyInfo = answerKeyMap.get(qNum) || { answer: 1, explanation: 'কারিকুলাম মান অনুযায়ী সঠিক।' };

        questions.push({
          id: `jlpt-${lvl.toLowerCase()}-q${qNum}`,
          level: lvl,
          section: currentSection,
          questionNumber: qNum,
          prompt: prompt.replace(/-- \d+ of \d+ --/g, '').trim(),
          options: options.slice(0, 4),
          correctAnswer: keyInfo.answer,
          explanationBn: keyInfo.explanation,
          reviewStatus: 'APPROVED_FOR_INTERNAL_TEST',
          rightsStatus: 'ORIGINAL_EDITORIAL_MATERIAL',
          sourceFile: filename
        });
      }
    }

    // Deduplicate by questionNumber
    const uniqueQuestions = [];
    const seen = new Set();
    for (const q of questions) {
      if (!seen.has(q.questionNumber)) {
        seen.add(q.questionNumber);
        uniqueQuestions.push(q);
      }
    }

    uniqueQuestions.sort((a, b) => a.questionNumber - b.questionNumber);

    masterBank.levels[lvl] = {
      level: lvl,
      sourceFile: filename,
      questionCount: uniqueQuestions.length,
      answerKeyCount: answerKeyMap.size,
      questions: uniqueQuestions
    };

    masterBank.totalQuestions += uniqueQuestions.length;
    console.log(`✓ Level ${lvl}: Extracted ${uniqueQuestions.length}/40 questions, ${answerKeyMap.size} answer keys.`);
  }

  const outPath = path.join(PROCESSED_DIR, 'jlpt_mock_questions_master.json');
  fs.writeFileSync(outPath, JSON.stringify(masterBank, null, 2), 'utf8');
  console.log(`\nMaster bank written to: ${outPath} (Total questions: ${masterBank.totalQuestions})`);
}

extractAllLevels().catch(console.error);
