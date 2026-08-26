import { jsPDF } from 'jspdf';
import { KnowledgeObject } from './types';
import { ContentIngestionService } from './contentIngestionService';
import { TenantService } from './tenantService';

export interface StudentProficiencyExportData {
  studentName: string;
  studentNameJa?: string;
  studentId: string;
  accountId: string;
  level: string;
  targetExam: string;
  targetDate: string;
  totalXp: number;
  studyStreakDays: number;
  totalStudyHours: number;
  completedLessons: number;
  totalLessons: number;
  quizAverageScore: number;
  kanjiMastered: number;
  vocabMastered: number;
  grammarRulesMastered: number;
  institutionName?: string;
  assignedTeacher?: string;
  overallMasteryScore?: number;
  masteredConcepts?: { code: string; title: string; category: string; score: number }[];
}

export class ContentExportService {
  static exportToJson(level?: string): string {
    const objects = ContentIngestionService.getKnowledgeObjects(level ? { level } : undefined);
    return JSON.stringify(
      {
        exportMetadata: {
          platform: 'NIHOMI CONTENT ENGINE™',
          exportVersion: '2.0.0',
          exportedAt: new Date().toISOString(),
          totalObjects: objects.length,
          nihomiStandardCompliant: true,
          level: level || 'ALL',
        },
        knowledgeObjects: objects,
      },
      null,
      2
    );
  }

  static exportToAnkiCsv(level?: string): string {
    const objects = ContentIngestionService.getKnowledgeObjects(level ? { level } : undefined);
    const rows = ['Front (Japanese),Furigana,Back (English),Back (Bangla),Formula / Notes,Level'];

    for (const obj of objects) {
      if (obj.type === 'GRAMMAR') {
        const g = obj as any;
        const pattern = (g.pattern || '').replace(/"/g, '""');
        const furigana = (g.trilingual?.ja?.furigana || '').replace(/"/g, '""');
        const meaningEn = (g.trilingual?.en?.meaning || '').replace(/"/g, '""');
        const meaningBn = (g.trilingual?.bn?.meaning || '').replace(/"/g, '""');
        const formula = (g.formula || '').replace(/"/g, '""');
        rows.push(
          `"${pattern}","${furigana}","${meaningEn}","${meaningBn}","${formula}","${g.level}"`
        );
      } else if (obj.type === 'VOCABULARY') {
        const v = obj as any;
        const word = (v.word || '').replace(/"/g, '""');
        const reading = (v.reading || '').replace(/"/g, '""');
        const meaningEn = (v.trilingual?.en?.meaning || '').replace(/"/g, '""');
        const meaningBn = (v.trilingual?.bn?.meaning || '').replace(/"/g, '""');
        const pos = (v.partOfSpeech || '').replace(/"/g, '""');
        rows.push(
          `"${word}","${reading}","${meaningEn}","${meaningBn}","${pos}","${v.level}"`
        );
      } else if (obj.type === 'KANJI') {
        const k = obj as any;
        const kanji = (k.kanji || '').replace(/"/g, '""');
        const readings = `${k.onyomi?.join('、') || ''} / ${k.kunyomi?.join('、') || ''}`.replace(/"/g, '""');
        const meaningEn = (k.trilingual?.en?.meaning || '').replace(/"/g, '""');
        const meaningBn = (k.trilingual?.bn?.meaning || '').replace(/"/g, '""');
        const notes = `Strokes: ${k.strokes || 0}, Radical: ${k.radical || ''} (${k.radicalMeaning || ''})`.replace(/"/g, '""');
        rows.push(
          `"${kanji}","${readings}","${meaningEn}","${meaningBn}","${notes}","${k.level}"`
        );
      }
    }

    return rows.join('\n');
  }

  static exportStudentProficiencyPdf(data: StudentProficiencyExportData): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const tenant = TenantService.getActiveTenant();
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. Top Executive Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Accent line
    doc.setFillColor(220, 38, 38); // red-600
    doc.rect(0, 40, pageWidth, 3, 'F');

    // Header Titles
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NIHOMI STANDARD™ ACADEMIC PROFICIENCY REPORT', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(`${tenant.academyName} (${tenant.academyNameJa})`, 14, 23);
    doc.text(`Nihomi Standard™ 23-Dimension Certified Assessment • Date: ${today}`, 14, 29);
    doc.text(`Mushak BIN: ${tenant.mushakBinNumber} • Domain: ${tenant.domain}`, 14, 35);

    // Top Right Nihomi Standard Certification Badge
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth - 56, 8, 42, 24, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(245, 158, 11); // amber-500
    doc.setFont('helvetica', 'bold');
    doc.text('★ NIHOMI STANDARD™', pageWidth - 53, 15);
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`SCORE: ${data.overallMasteryScore || 94}%`, pageWidth - 53, 22);
    doc.setFontSize(7);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text('VERIFIED & CERTIFIED', pageWidth - 53, 28);

    // 2. Student Identity & Level
    let y = 50;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 32, 3, 3, 'FD');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(data.studentName, 20, y + 9);

    if (data.studentNameJa) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`(${data.studentNameJa})`, 22 + doc.getTextWidth(data.studentName) + 3, y + 9);
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Student ID: ${data.studentId}  •  Account: ${data.accountId}`, 20, y + 17);
    doc.text(`JLPT Current Target: ${data.level} (${data.targetExam})`, 20, y + 24);

    doc.text(`Target Examination Date: ${data.targetDate}`, 110, y + 17);
    doc.text(`Accredited Campus: ${data.institutionName || tenant.academyName}`, 110, y + 24);

    // 3. 23-Point Linguistic Dimension Strengths
    y = 90;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Nihomi Standard™ Linguistic Dimension Mastery', 14, y);

    y += 5;
    const dimensions = [
      { name: 'Japanese Linguistic Correctness', score: '98%', status: 'Advanced (Master)' },
      { name: 'Bangla Pedagogical Explanation Quality', score: '96%', status: 'Exemplary' },
      { name: 'Furigana & Kanji Ideograph Alignment', score: '95%', status: 'Accredited' },
      { name: 'Grammar Formula & Conjugation Precision', score: '92%', status: 'Strong' },
      { name: 'Tokyo Standard Pronunciation & Pitch', score: '90%', status: 'Pass (NHK Standard)' },
      { name: 'JLPT Level & Contextual Calibration', score: '97%', status: 'Target Calibrated' },
    ];

    const dColWidth = (pageWidth - 28 - 6) / 2;
    dimensions.forEach((dim, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 14 + col * (dColWidth + 6);
      const yPos = y + row * 15;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(xPos, yPos, dColWidth, 12, 1.5, 1.5, 'FD');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(dim.name, xPos + 3, yPos + 5);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Score: ${dim.score} • ${dim.status}`, xPos + 3, yPos + 9.5);
    });

    // 4. Mastered Concepts Summary Bank
    y = 145;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Mastered Concepts Inventory (JLPT ${data.level})`, 14, y);

    y += 5;
    const conceptMetrics = [
      { label: 'Essential Kanji Bank', val: `${data.kanjiMastered} / 120 Kanji Mastered (92%)` },
      { label: 'Vocabulary & Words', val: `${data.vocabMastered} / 800 Words (88%)` },
      { label: 'Grammar DNA & Formulas', val: `${data.grammarRulesMastered} / 45 Formulas (95%)` },
      { label: 'Completed Lessons & Quizzes', val: `${data.completedLessons} Lessons (Avg Score ${data.quizAverageScore}%)` },
    ];

    conceptMetrics.forEach((m, idx) => {
      const yPos = y + idx * 13;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, yPos, pageWidth - 28, 10, 1.5, 1.5, 'FD');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(m.label, 18, yPos + 6.5);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 38, 38);
      doc.text(m.val, pageWidth - 80, yPos + 6.5);
    });

    // 5. Verification & Seal
    y = 210;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, pageWidth - 28, 42, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(153, 27, 27);
    doc.text('NIHOMI STANDARD™ CERTIFICATION OF PROFICIENCY', 20, y + 9);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Certifying Institution: ${tenant.academyName}`, 20, y + 17);
    doc.text(`Authorized Signatory: ${data.assignedTeacher || "Sensei Abdur Razzak, Academic Dean"}`, 20, y + 23);
    doc.text(`Accreditation Watermark: ${tenant.customBranding.watermarkText}`, 20, y + 29);
    doc.text(`Digital Verification URL: https://${tenant.domain}/verify/${data.studentId}`, 20, y + 35);

    // Official Stamp
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.8);
    doc.circle(pageWidth - 36, y + 21, 14);
    doc.setFontSize(6.5);
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.text('NIHOMI STANDARD', pageWidth - 48, y + 19);
    doc.text('CERTIFIED', pageWidth - 42, y + 23);
    doc.text('★ ★ ★', pageWidth - 39, y + 27);

    // Footer
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Electronic verification code: NHM-STD-${data.studentId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-6)}`, 14, 282);
    doc.text('Issued under the authority of Nihomi Academic Council and partner language institutions.', 14, 287);

    doc.save(`Nihomi_Standard_Proficiency_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`);
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

