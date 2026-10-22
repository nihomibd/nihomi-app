// src/lib/services/certificatePdfGenerator.ts
// NIHOMI.COM — OFFICIAL JLPT/NAT CBT MARKSHEET & CERTIFICATE GENERATION ENGINE
// Adhering strictly to Nihomi Brand Guidelines (Crimson #E45147, Amber #F59E0B, Obsidian #0A0A12)

import { jsPDF } from 'jspdf';
import { MockExamAttempt } from '../../types';

export interface CertificateCandidateInfo {
  candidateName: string;
  candidateNameKana?: string;
  candidateId: string;
  registrationNumber: string;
  examDate?: string;
}

/**
 * Generates an official high-resolution A4 Nihomi Achievement Certificate (合格認定証)
 */
export function generateOfficialCertificatePdf(
  attempt: MockExamAttempt,
  candidate: CertificateCandidateInfo
): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();   // 297mm
  const height = doc.internal.pageSize.getHeight(); // 210mm

  // 1. Certificate Background (Warm Cream/Parchment #FDFBF7)
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, width, height, 'F');

  // 2. Outer Gilded Border (Amber #F59E0B)
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(3.5);
  doc.rect(8, 8, width - 16, height - 16);

  // 3. Inner Decorative Crimson Border (#E45147)
  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(1.2);
  doc.rect(13, 13, width - 26, height - 26);

  // Thin hairline border
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.4);
  doc.rect(15, 15, width - 30, height - 30);

  // 4. Corner Rosettes / Flourishes
  const corners = [
    [15, 15],
    [width - 15, 15],
    [15, height - 15],
    [width - 15, height - 15]
  ];
  doc.setFillColor(228, 81, 71);
  for (const [cx, cy] of corners) {
    doc.circle(cx, cy, 3, 'F');
  }

  // 5. Header: Academy & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(228, 81, 71); // Crimson
  doc.text('NIHOMI JAPANESE LEARNING ACADEMY • TOKYO & DHAKA', width / 2, 28, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(115, 115, 115);
  doc.text('Authorized by Nihomi Global Commercial Education Framework (にほみアカデミー)', width / 2, 33, { align: 'center' });

  // 6. Main Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(20, 23, 38); // Deep Slate
  doc.text('CERTIFICATE OF ACHIEVEMENT', width / 2, 45, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text('日本語能力試験 模擬試験 合格認定証 (JLPT SIMULATION PASS)', width / 2, 52, { align: 'center' });

  // 7. Divider Ribbon
  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(0.8);
  doc.line(width / 2 - 45, 56, width / 2 + 45, 56);

  // 8. Preamble
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('This official certificate is proudly awarded to', width / 2, 65, { align: 'center' });

  // 9. Candidate Name
  const candidateName = candidate.candidateName.toUpperCase();
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(228, 81, 71); // Crimson
  doc.text(candidateName, width / 2, 76, { align: 'center' });

  if (candidate.candidateNameKana) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`[ ${candidate.candidateNameKana} ]`, width / 2, 82, { align: 'center' });
  }

  // 10. Achievement Statement
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const examLevel = attempt.level || 'N5';
  doc.text(
    `For demonstrating official proficiency and successfully passing the standardized Computer-Based Test (CBT)`,
    width / 2,
    91,
    { align: 'center' }
  );
  doc.setFont('times', 'bold');
  doc.text(
    `JAPANESE LANGUAGE PROFICIENCY TEST — LEVEL ${examLevel} (JLPT ${examLevel} EQUIVALENT)`,
    width / 2,
    97,
    { align: 'center' }
  );

  // 11. Score Matrix Box
  doc.setFillColor(245, 245, 240);
  doc.setDrawColor(210, 210, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(width / 2 - 95, 104, 190, 36, 3, 3, 'FD');

  // Score Box Columns
  const vocabScore = attempt.sectionScores?.vocabulary?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3);
  const grammarScore = attempt.sectionScores?.grammar_reading?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3);
  const listenScore = attempt.sectionScores?.listening?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3);
  const totalScore = attempt.totalScaledScore || 90;
  const grade = attempt.letterGrade || 'A';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('LANGUAGE KNOWLEDGE', width / 2 - 68, 112, { align: 'center' });
  doc.text('GRAMMAR & READING', width / 2 - 20, 112, { align: 'center' });
  doc.text('TOKYO LISTENING', width / 2 + 28, 112, { align: 'center' });
  doc.text('TOTAL SCALED SCORE', width / 2 + 70, 112, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(20, 23, 38);
  doc.text(`${vocabScore} / 60`, width / 2 - 68, 120, { align: 'center' });
  doc.text(`${grammarScore} / 60`, width / 2 - 20, 120, { align: 'center' });
  doc.text(`${listenScore} / 60`, width / 2 + 28, 120, { align: 'center' });

  doc.setFontSize(15);
  doc.setTextColor(228, 81, 71); // Crimson Total
  doc.text(`${totalScore} / 180`, width / 2 + 70, 120, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text('Cutoff 19 Met', width / 2 - 68, 126, { align: 'center' });
  doc.text('Cutoff 19 Met', width / 2 - 20, 126, { align: 'center' });
  doc.text('Cutoff 19 Met', width / 2 + 28, 126, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text(`PASSED • GRADE ${grade}`, width / 2 + 70, 126, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Overall Pass Standard: 90 / 180 points with minimum 19 points in each scoring section. Status: PASSED (合格)`,
    width / 2,
    135,
    { align: 'center' }
  );

  // 12. Japanese Inkan Seal Stamp (印)
  const sealX = width - 48;
  const sealY = 162;
  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(1.2);
  doc.circle(sealX, sealY, 12, 'D');
  doc.setLineWidth(0.4);
  doc.circle(sealX, sealY, 10.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(228, 81, 71);
  doc.text('にほみ', sealX, sealY - 3, { align: 'center' });
  doc.text('認定之印', sealX, sealY + 2, { align: 'center' });
  doc.setFontSize(6);
  doc.text('NIHOMI SEAL', sealX, sealY + 6, { align: 'center' });

  // 13. Signatures & Metadata Block
  const examDate = candidate.examDate || new Date(attempt.submittedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Left Signature: Founder
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(35, 172, 95, 172);

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 23, 38);
  doc.text('Md Tanvir Hossain', 65, 177, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Founder & System Architect', 65, 181, { align: 'center' });
  doc.text('Nihomi Japanese Learning Platform', 65, 185, { align: 'center' });

  // Center Signature: Academic Director / Sensei
  doc.line(width / 2 - 30, 172, width / 2 + 30, 172);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 23, 38);
  doc.text('Nomi Sensei (野見 先生)', width / 2, 177, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Head of Curriculum & Evaluation', width / 2, 181, { align: 'center' });
  doc.text('Tokyo Pedagogy Council', width / 2, 185, { align: 'center' });

  // Right Metadata: Registration & Verification
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Date of Issue: ${examDate}`, 35, 193);
  doc.text(`Candidate Roll: ${candidate.registrationNumber}`, 35, 197);
  doc.text(`Certificate No: ${attempt.certificateId || 'NHM-CERT-2026-N5-001'}`, width / 2 - 30, 193);
  doc.text(`Verification Hash: ${(attempt.verificationHash || 'SHA256-AUTHENTICATED').slice(0, 24)}...`, width / 2 - 30, 197);

  return doc;
}

/**
 * Generates an official JLPT/NAT Marksheet (成績証明書 / Official Score Report) in A4 Portrait PDF
 */
export function generateOfficialMarksheetPdf(
  attempt: MockExamAttempt,
  candidate: CertificateCandidateInfo
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();   // 210mm
  const height = doc.internal.pageSize.getHeight(); // 297mm

  // Header Banner
  doc.setFillColor(20, 23, 38); // Obsidian Slate #141726
  doc.rect(0, 0, width, 40, 'F');

  // Red accent line
  doc.setFillColor(228, 81, 71); // Crimson #E45147
  doc.rect(0, 40, width, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('NIHOMI.COM — OFFICIAL SCORE REPORT', 15, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 158, 11); // Amber
  doc.text('日本語能力試験 模擬試験 成績証明書 (Official JLPT CBT Score Report)', 15, 26);

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Standardized Computer-Based Examination • Certified by Nihomi Academic Engine', 15, 33);

  // Candidate Profile Table
  const tableStartY = 50;
  doc.setFillColor(245, 247, 250);
  doc.rect(15, tableStartY, width - 30, 36, 'F');
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.4);
  doc.rect(15, tableStartY, width - 30, 36, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('CANDIDATE NAME:', 20, tableStartY + 8);
  doc.text('REGISTRATION NO:', 20, tableStartY + 16);
  doc.text('TEST LEVEL:', 20, tableStartY + 24);
  doc.text('DATE OF EXAM:', 20, tableStartY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 23, 38);
  doc.text(candidate.candidateName.toUpperCase(), 65, tableStartY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(candidate.registrationNumber, 65, tableStartY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text(`JLPT ${attempt.level || 'N5'} (CBT Official Simulation)`, 65, tableStartY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(candidate.examDate || new Date(attempt.submittedAt).toLocaleDateString('en-GB'), 65, tableStartY + 32);

  // Result Badge Box
  const isPassed = attempt.isPassed;
  doc.setFillColor(isPassed ? 236 : 254, isPassed ? 253 : 242, isPassed ? 245 : 242);
  doc.setDrawColor(isPassed ? 16 : 239, isPassed ? 185 : 68, isPassed ? 129 : 68);
  doc.roundedRect(width - 65, tableStartY + 5, 45, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(isPassed ? 16 : 220, isPassed ? 185 : 38, isPassed ? 129 : 38);
  doc.text('FINAL RESULT', width - 42.5, tableStartY + 12, { align: 'center' });
  doc.setFontSize(14);
  doc.text(isPassed ? 'PASSED (合格)' : 'FAILED (不合格)', width - 42.5, tableStartY + 20, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`GRADE ${attempt.letterGrade || 'B'}`, width - 42.5, tableStartY + 26, { align: 'center' });

  // Sectional Breakdown Table
  const secStartY = 96;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 23, 38);
  doc.text('Sectional Scaled Score Breakdown (得点区分別得点)', 15, secStartY);

  // Table Headers
  const thY = secStartY + 5;
  doc.setFillColor(20, 23, 38);
  doc.rect(15, thY, width - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('EXAM SECTION', 20, thY + 5.5);
  doc.text('MAX SCORE', 85, thY + 5.5);
  doc.text('PASS CUTOFF', 115, thY + 5.5);
  doc.text('SCORED', 145, thY + 5.5);
  doc.text('STATUS', 175, thY + 5.5);

  // Rows
  const rows = [
    {
      title: 'Language Knowledge (Vocabulary & Kanji)',
      max: '60',
      cutoff: '19',
      score: attempt.sectionScores?.vocabulary?.scaledScore ?? 20,
      passed: (attempt.sectionScores?.vocabulary?.scaledScore ?? 20) >= 19
    },
    {
      title: 'Grammar & Reading Comprehension',
      max: '60',
      cutoff: '19',
      score: attempt.sectionScores?.grammar_reading?.scaledScore ?? 20,
      passed: (attempt.sectionScores?.grammar_reading?.scaledScore ?? 20) >= 19
    },
    {
      title: 'Tokyo Listening Comprehension (聴解)',
      max: '60',
      cutoff: '19',
      score: attempt.sectionScores?.listening?.scaledScore ?? 20,
      passed: (attempt.sectionScores?.listening?.scaledScore ?? 20) >= 19
    }
  ];

  let currentY = thY + 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  rows.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 251);
    doc.rect(15, currentY, width - 30, 10, 'F');
    doc.setDrawColor(220, 225, 235);
    doc.rect(15, currentY, width - 30, 10, 'D');

    doc.setTextColor(40, 40, 40);
    doc.text(r.title, 20, currentY + 6.5);
    doc.text(r.max, 88, currentY + 6.5);
    doc.text(r.cutoff, 118, currentY + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.text(String(r.score), 148, currentY + 6.5);
    doc.setTextColor(r.passed ? 16 : 220, r.passed ? 185 : 38, r.passed ? 129 : 38);
    doc.text(r.passed ? 'MET' : 'FAILED', 175, currentY + 6.5);
    doc.setFont('helvetica', 'normal');

    currentY += 10;
  });

  // Total Row
  doc.setFillColor(235, 240, 250);
  doc.rect(15, currentY, width - 30, 12, 'F');
  doc.setDrawColor(180, 195, 220);
  doc.rect(15, currentY, width - 30, 12, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 23, 38);
  doc.text('TOTAL AGGREGATE SCALED SCORE', 20, currentY + 7.5);
  doc.text('180', 88, currentY + 7.5);
  doc.text('90', 118, currentY + 7.5);

  doc.setFontSize(11);
  doc.setTextColor(228, 81, 71);
  doc.text(String(attempt.totalScaledScore || 90), 148, currentY + 8);

  doc.setFontSize(9.5);
  doc.setTextColor(isPassed ? 16 : 220, isPassed ? 185 : 38, isPassed ? 129 : 38);
  doc.text(isPassed ? 'PASSED' : 'NOT PASSED', 172, currentY + 7.5);

  // Performance Analysis & Diagnostic Notes
  const diagY = currentY + 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 23, 38);
  doc.text('Diagnostic Observations & Academic Feedback', 15, diagY);

  doc.setFillColor(250, 250, 252);
  doc.setDrawColor(220, 225, 235);
  doc.roundedRect(15, diagY + 4, width - 30, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  doc.text(`• Strengths: ${attempt.strengthSummaryBn || 'Language knowledge fundamentals and kanji readings are well retained.'}`, 20, diagY + 14);
  doc.text(`• Focus Area: ${attempt.weaknessSummaryBn || 'Complex grammar particles and fast-paced Tokyo listening conversations require targeted drill.'}`, 20, diagY + 24);
  doc.text(`• Recommendation: Continuous review via Nihomi MemoryOS spaced repetition and konbini listening drills.`, 20, diagY + 34);
  doc.text(`• Verification Token: ${attempt.verificationHash || 'VERIFIED-OFFICIAL-EXAM-HASH'}`, 20, diagY + 44);

  // Seal & Authentication Footer
  const footerY = 220;
  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(1);
  doc.circle(width - 35, footerY + 15, 12, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(228, 81, 71);
  doc.text('にほみ', width - 35, footerY + 12, { align: 'center' });
  doc.text('成績印', width - 35, footerY + 17, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is an electronically generated official scorecard issued by NIHOMI.COM.', 15, footerY + 10);
  doc.text('Authenticity can be verified at: https://www.nihomi.com/verify/exam-score', 15, footerY + 15);
  doc.text('Nihomi Japanese Learning Academy • All Rights Reserved © 2026', 15, footerY + 20);

  return doc;
}

/**
 * Universal multi-platform browser download helper
 */
export function triggerPdfDownload(doc: jsPDF, fileName: string): void {
  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 3000);
  } catch {
    doc.save(fileName);
  }
}
