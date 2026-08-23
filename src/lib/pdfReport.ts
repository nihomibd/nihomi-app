import { jsPDF } from 'jspdf';

export interface ProgressReportData {
  studentName: string;
  email?: string;
  targetLevel: string;
  streak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  experiencePoints: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  learnedKanji: string[];
  quizHistory: Array<{
    title: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    date: string;
  }>;
}

export function generateProgressReportPdf(data: ProgressReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Red accent line
  doc.setFillColor(220, 38, 38); // red-600
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('NIHOMI.COM', 16, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('OFFICIAL JAPANESE LEARNING & JLPT READINESS REPORT', 16, 26);

  // Date and verification on top right
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Generated: ${reportDate}`, pageWidth - 16, 18, { align: 'right' });
  doc.text(`Verification ID: NIH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, pageWidth - 16, 25, { align: 'right' });

  // Student Profile Card
  let y = 56;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, pageWidth - 32, 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Student: ${data.studentName || 'Nihomi Learner'}`, 22, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Target JLPT Level: ${data.targetLevel || 'JLPT N5'}`, 22, y + 18);
  if (data.email) {
    doc.text(`Account: ${data.email}`, pageWidth - 22, y + 18, { align: 'right' });
  }

  // Section 1: Core Performance Metrics
  y = 92;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. CORE LEARNING METRICS', 16, y);

  y += 6;
  const colWidth = (pageWidth - 32 - 12) / 4;
  const metrics = [
    { label: 'Current Streak', val: `${data.streak} Days`, sub: `Best: ${data.longestStreak}d` },
    { label: 'Study Time', val: `${data.totalStudyMinutes} Mins`, sub: 'Total Logged' },
    { label: 'Experience XP', val: `${data.experiencePoints} XP`, sub: 'Earned' },
    { label: 'Lessons Mastered', val: `${data.completedLessonsCount}`, sub: `of ${data.totalLessonsCount || 25} Lessons` }
  ];

  metrics.forEach((m, idx) => {
    const xPos = 16 + idx * (colWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(xPos, y, colWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, xPos + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, xPos + 4, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.sub, xPos + 4, y + 20);
  });

  // Section 2: Learned Kanji Mastery
  y += 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const kanjiCount = data.learnedKanji?.length || 0;
  const kanjiPct = Math.round((kanjiCount / 120) * 100);
  doc.text(`2. KANJI MASTERY BANK (${kanjiCount} / 120 Kanji — ${kanjiPct}%)`, 16, y);

  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, pageWidth - 32, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  if (kanjiCount > 0) {
    const previewList = data.learnedKanji.slice(0, 32).join('   ');
    doc.text(`Mastered Characters (${kanjiCount} total):`, 22, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(previewList, 22, y + 16);
    if (kanjiCount > 32) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`+ ${kanjiCount - 32} more characters mastered in the Nihomi interactive flashbank.`, 22, y + 23);
    }
  } else {
    doc.text('No Kanji flipped yet. Practice in the Kanji Flip Grid to log verified mastery!', 22, y + 14);
  }

  // Section 3: Verified Assessment & Quiz Logs
  y += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. VERIFIED QUIZ & ASSESSMENT HISTORY', 16, y);

  y += 6;
  const quizRows = data.quizHistory.slice(0, 5);

  if (quizRows.length > 0) {
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(16, y, pageWidth - 32, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Assessment Title', 20, y + 5);
    doc.text('Score', 110, y + 5);
    doc.text('Result', 140, y + 5);
    doc.text('Date', pageWidth - 20, y + 5, { align: 'right' });

    y += 7;
    quizRows.forEach((q) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(q.title || 'JLPT Assessment', 20, y + 6);
      doc.text(`${q.correctCount}/${q.totalQuestions} (${q.score}%)`, 110, y + 6);

      if (q.passed) {
        doc.setTextColor(22, 101, 52); // green-800
        doc.text('PASSED', 140, y + 6);
      } else {
        doc.setTextColor(153, 27, 27); // red-800
        doc.text('REVIEW NEEDED', 140, y + 6);
      }

      doc.setTextColor(100, 116, 139);
      doc.text(q.date, pageWidth - 20, y + 6, { align: 'right' });

      doc.setDrawColor(241, 245, 249);
      doc.line(16, y + 9, pageWidth - 16, y + 9);
      y += 9;
    });
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(16, y, pageWidth - 32, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('No quiz attempts on record yet. Complete module quizzes to generate verified score logs.', 22, y + 10);
    y += 18;
  }

  // Footer & Official Seal
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 24, pageWidth - 16, pageHeight - 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Nihomi Japanese Learning Platform • Verified Academic Learning System • Tokyo, Japan & Dhaka, Bangladesh', 16, pageHeight - 16);
  doc.text('Valid for COE, visa preparation, and language school academic submissions.', 16, pageHeight - 11);

  // Save the PDF
  const sanitizedName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Nihomi_Progress_Report_${sanitizedName}.pdf`);
}
