import { jsPDF } from 'jspdf';

export interface StudentReportData {
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
  issueDate?: string;
}

export function generateStudentSummaryPdf(data: StudentReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = data.issueDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // 1. Executive Top Header (Slate & Red Accent)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Red accent bottom stripe
  doc.setFillColor(220, 38, 38); // red-600
  doc.rect(0, 38, pageWidth, 3, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NIHOMI JAPANESE ACADEMIC RECORD', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Dhaka International Language School × Nihomi EdTech Platform', 14, 25);
  doc.text(`Official Student Proficiency & Progress Summary • Generated: ${today}`, 14, 31);

  // Top right badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 48, 10, 34, 18, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(239, 68, 68);
  doc.setFont('helvetica', 'bold');
  doc.text('JLPT TARGET', pageWidth - 45, 17);
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(data.level, pageWidth - 45, 24);

  // 2. Student Identity Box
  let y = 50;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
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
  doc.text(`Student ID: ${data.studentId}`, 20, y + 18);
  doc.text(`Account ID: ${data.accountId}`, 20, y + 25);

  doc.text(`Target Examination: ${data.targetExam}`, 110, y + 18);
  doc.text(`Target Date: ${data.targetDate}`, 110, y + 25);

  // 3. Core Milestone KPI Cards (4 Column Grid)
  y = 90;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Key Performance & Consistency Metrics', 14, y);

  y += 5;
  const colWidth = (pageWidth - 28 - 9) / 4;
  const kpis = [
    { label: 'Total XP Earned', value: `${data.totalXp.toLocaleString()} XP`, color: [220, 38, 38] },
    { label: 'Active Study Streak', value: `${data.studyStreakDays} Days`, color: [217, 119, 6] },
    { label: 'Total Study Time', value: `${data.totalStudyHours} Hours`, color: [16, 185, 129] },
    { label: 'Quiz Mastery Avg', value: `${data.quizAverageScore}%`, color: [37, 99, 235] },
  ];

  kpis.forEach((kpi, idx) => {
    const xPos = 14 + idx * (colWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(xPos, y, colWidth, 24, 2, 2, 'FD');

    // color bar
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.rect(xPos, y, colWidth, 1.5, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, xPos + 3, y + 8);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, xPos + 3, y + 18);
  });

  // 4. Curriculum Progress Breakdown
  y = 128;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Curriculum & Skill Mastery Breakdown', 14, y);

  y += 6;
  const skills = [
    { title: 'Core Lesson Progress', count: `${data.completedLessons} / ${data.totalLessons} Lessons`, percent: Math.round((data.completedLessons / (data.totalLessons || 1)) * 100) },
    { title: 'Essential Kanji Bank', count: `${data.kanjiMastered} / 120 Kanji`, percent: Math.min(100, Math.round((data.kanjiMastered / 120) * 100)) },
    { title: 'Active Vocabulary Bank', count: `${data.vocabMastered} / 800 Words`, percent: Math.min(100, Math.round((data.vocabMastered / 800) * 100)) },
    { title: 'Grammar Patterns & Conjugations', count: `${data.grammarRulesMastered} / 45 Patterns`, percent: Math.min(100, Math.round((data.grammarRulesMastered / 45) * 100)) },
  ];

  skills.forEach((skill) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(skill.title, 18, y + 7);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(skill.count, 18, y + 12);

    // Progress Bar
    const barWidth = 60;
    const barX = pageWidth - 14 - barWidth - 16;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, y + 6, barWidth, 4, 1.5, 1.5, 'F');

    doc.setFillColor(220, 38, 38);
    const filledWidth = Math.max(2, (skill.percent / 100) * barWidth);
    doc.roundedRect(barX, y + 6, filledWidth, 4, 1.5, 1.5, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`${skill.percent}%`, pageWidth - 24, y + 9.5);

    y += 20;
  });

  // 5. Institutional Certification & Academic Seal
  y = 222;
  doc.setFillColor(254, 242, 242); // red-50
  doc.setDrawColor(254, 202, 202); // red-200
  doc.roundedRect(14, y, pageWidth - 28, 36, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(153, 27, 27); // red-800
  doc.text('INSTITUTIONAL VALIDATION & ACADEMIC STANDING', 20, y + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Affiliated Center: ${data.institutionName || "Dhaka International Language School (DILS)"}`, 20, y + 17);
  doc.text(`Assigned Head Instructor: ${data.assignedTeacher || "Sensei Abdur Razzak, DILS Academic Dean"}`, 20, y + 23);
  doc.text('Verification Portal: https://nihomi.com/verify/student-record', 20, y + 29);

  // Decorative Seal Box
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.8);
  doc.circle(pageWidth - 36, y + 18, 12);
  doc.setFontSize(6.5);
  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL SEAL', pageWidth - 46, y + 17);
  doc.text('NIHOMI DILS', pageWidth - 45, y + 21);

  // Footer
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('This is an electronically verifiable progress record generated by the Nihomi.com Learning Management System.', 14, 280);
  doc.text(`Document Reference: NHM-REC-${data.studentId.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`, 14, 285);

  // Save the PDF
  doc.save(`Nihomi_Student_Report_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`);
}
