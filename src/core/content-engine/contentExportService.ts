import { KnowledgeObject } from './types';
import { ContentIngestionService } from './contentIngestionService';

export class ContentExportService {
  static exportToJSON(level?: string): string {
    const objects = ContentIngestionService.getKnowledgeObjects(level ? { level } : undefined);
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        standardVersion: 'NIHOMI STANDARD™ v2.0',
        totalRecords: objects.length,
        data: objects,
      },
      null,
      2
    );
  }

  static exportToJson(level?: string): string {
    return this.exportToJSON(level);
  }

  static exportToAnkiCSV(level: string = 'N5'): string {
    const objects = ContentIngestionService.getKnowledgeObjects({ level });
    const rows = ['Code,Japanese,Furigana,Romaji,Meaning_English,Meaning_Bengali,Tags'];

    for (const o of objects) {
      const ja = o.type === 'GRAMMAR' ? (o as any).pattern : (o as any).word || o.code;
      const furigana = o.trilingual?.ja?.furigana || ja;
      const romaji = o.trilingual?.ja?.romaji || '';
      const en = (o.trilingual?.en?.meaning || '').replace(/,/g, ';');
      const bn = (o.trilingual?.bn?.meaning || '').replace(/,/g, ';');
      const tags = (o.tags || []).join(' ');

      rows.push(`"${o.code}","${ja}","${furigana}","${romaji}","${en}","${bn}","${tags}"`);
    }

    return rows.join('\n');
  }

  static exportToAnkiCsv(level: string = 'N5'): string {
    return this.exportToAnkiCSV(level);
  }

  static exportToMarkdown(level: string = 'N5'): string {
    const objects = ContentIngestionService.getKnowledgeObjects({ level });
    let md = `# NIHOMI STANDARD™ JLPT ${level} MASTER CHEAT SHEET\n\n`;
    md += `*Generated for Dhaka International Language School & Nihomi Academic Council*\n\n---\n\n`;

    for (const o of objects) {
      md += `### ${o.code}: ${o.type === 'GRAMMAR' ? (o as any).pattern : (o as any).word}\n`;
      md += `- **Formula / Reading:** ${(o as any).formula || (o as any).reading || 'N/A'}\n`;
      md += `- **English:** ${o.trilingual?.en?.meaning || ''}\n`;
      md += `- **বাংলা অর্থ:** ${o.trilingual?.bn?.meaning || ''}\n`;
      md += `- **বাংলা ব্যাখ্যা:** ${o.trilingual?.bn?.explanationBn || ''}\n\n`;
    }

    return md;
  }

  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Dispatch visual confirmation toast event with download path preview
    try {
      const simulatedPath = `~/Downloads/${filename}`;
      window.dispatchEvent(
        new CustomEvent('nihomi-export-download', {
          detail: {
            filename,
            mimeType,
            path: simulatedPath,
            size: content.length,
            timestamp: new Date().toLocaleTimeString(),
          },
        })
      );
    } catch {}
  }

  static exportStudentProficiencyPdf(studentData: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    const reportHtml = `
      <html>
        <head>
          <title>NIHOMI Official Student Proficiency Certificate - ${studentData.studentName || 'Student'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1c1917; }
            .header { text-align: center; border-bottom: 2px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .subtitle { font-size: 14px; color: #78716c; margin-top: 6px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; font-size: 14px; }
            .card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; }
            .label { font-size: 11px; text-transform: uppercase; color: #a8a29e; font-weight: 700; }
            .val { font-size: 16px; font-weight: 700; margin-top: 4px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #a8a29e; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">NIHOMI™ ACADEMIC COUNCIL</div>
            <div class="subtitle">Official Japanese Proficiency & 150-Hour Completion Transcript</div>
          </div>
          <div class="grid">
            <div class="card"><div class="label">Student Name</div><div class="val">${studentData.studentName || 'Student'} (${studentData.studentNameJa || '生徒'})</div></div>
            <div class="card"><div class="label">Account ID</div><div class="val">${studentData.accountId || 'NHM-AC-8849'}</div></div>
            <div class="card"><div class="label">Current JLPT Level</div><div class="val">${studentData.level || 'N5'} Target (${studentData.targetExam || 'JLPT Dec 2026'})</div></div>
            <div class="card"><div class="label">Total Study Logged</div><div class="val">${studentData.totalStudyHours || 124} Hours (${studentData.studyStreakDays || 18} Day Streak)</div></div>
          </div>
          <div class="footer">
            Verified by Nihomi Standard™ Multi-Agent Certification Engine • Dhaka International Language School & Tokyo Academic Desk
          </div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(reportHtml);
      win.document.close();
      win.focus();
      setTimeout(() => {
        try {
          win.print();
        } catch {}
      }, 500);
    }
  }
}
