import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LessonCurriculum } from '../data/lessons/n5MasterCurriculum';

export interface StudyGuidePdfOptions {
  difficulty?: 'simplified' | 'detailed';
  includeBengali?: boolean;
  studentName?: string;
}

/**
 * Generates a clean, professional, print-ready PDF study sheet for any JLPT N5 Lesson
 * Combines html2canvas high-res vector/pixel rendering with jsPDF multi-page output
 */
export async function generateLessonStudyGuidePdf(
  lesson: LessonCurriculum,
  elementToCapture?: HTMLElement | null,
  options: StudyGuidePdfOptions = {}
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const studentName = options.studentName || 'Nihomi Student';

  // If a DOM element is passed, attempt html2canvas screenshot capture for pixel-perfect visual styling
  if (elementToCapture) {
    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save(`NIHOMI_Lesson_${lesson.lessonNumber}_Study_Guide.pdf`);
      return;
    } catch (err) {
      console.warn('html2canvas capture fallback to standard jsPDF generation:', err);
    }
  }

  // Pure jsPDF Structured Vector Generation Fallback
  const margin = 14;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a (Slate 900)
  doc.rect(margin, y, 182, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`NIHOMI.COM - JLPT N5 STUDY GUIDE`, margin + 6, y + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Lesson ${lesson.lessonNumber}: ${lesson.titleEnglish}`, margin + 6, y + 15);

  doc.setFontSize(8);
  doc.text(`Student: ${studentName} | Topic: ${lesson.topic}`, margin + 6, y + 20);

  y += 30;

  // 1. Vocabulary Section
  doc.setFillColor(239, 68, 68); // Red 500
  doc.rect(margin, y, 3, 6, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`1. Essential Vocabulary & Expressions (${lesson.vocabularies.length} items)`, margin + 6, y + 5);

  y += 9;

  // Vocab table headers
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, 182, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Japanese (Kanji / Reading)', margin + 3, y + 4);
  doc.text('Romaji', margin + 70, y + 4);
  doc.text('English Meaning', margin + 110, y + 4);
  doc.text('Bengali Meaning', margin + 150, y + 4);

  y += 7;
  doc.setFont('helvetica', 'normal');

  lesson.vocabularies.slice(0, 15).forEach((v, index) => {
    if (y > 275) {
      doc.addPage();
      y = margin;
    }

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, 182, 6, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(`${v.kanji || v.hiragana} (${v.hiragana})`, margin + 3, y + 3);
    doc.text(v.romaji || '-', margin + 70, y + 3);
    doc.text(v.meaningEnglish.length > 24 ? v.meaningEnglish.substring(0, 24) + '...' : v.meaningEnglish, margin + 110, y + 3);
    doc.text(v.meaningBengali.length > 20 ? v.meaningBengali.substring(0, 20) + '...' : v.meaningBengali, margin + 150, y + 3);

    y += 5.5;
  });

  y += 6;

  // 2. Key Grammar Patterns
  if (y > 240) {
    doc.addPage();
    y = margin;
  }

  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(margin, y, 3, 6, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`2. Key Grammar Structures (${lesson.grammarPatterns.length} Patterns)`, margin + 6, y + 5);

  y += 9;

  lesson.grammarPatterns.forEach((g, idx) => {
    if (y > 255) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(245, 243, 255);
    doc.rect(margin, y, 182, 16, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text(`Pattern ${idx + 1}: ${g.pattern}`, margin + 4, y + 5);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`Rule: ${g.explanationEnglish}`, margin + 4, y + 10);
    doc.text(`Bengali: ${g.explanationBengali}`, margin + 4, y + 14);

    y += 19;
  });

  // 3. Kanji Summary
  if (lesson.kanjiList && lesson.kanjiList.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(217, 119, 6); // Amber 600
    doc.rect(margin, y, 3, 6, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`3. Target Kanji Characters (${lesson.kanjiList.length} Kanji)`, margin + 6, y + 5);

    y += 9;

    lesson.kanjiList.forEach((k) => {
      if (y > 265) {
        doc.addPage();
        y = margin;
      }

      doc.setFillColor(254, 243, 199);
      doc.rect(margin, y, 18, 14, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(k.kanji, margin + 5, y + 9);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Strokes: ${k.strokeCount} | Meaning: ${k.meaningEnglish} (${k.meaningBengali})`, margin + 22, y + 5);
      doc.text(`Onyomi: ${k.onyomi.join(', ') || '-'} | Kunyomi: ${k.kunyomi.join(', ') || '-'}`, margin + 22, y + 10);

      y += 17;
    });
  }

  // Footer stamp on last page
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated by Nihomi Japanese Learning Platform (nihomi.com) • Certificate & JLPT N5 Preparation Module`, margin, 290);

  doc.save(`NIHOMI_Lesson_${lesson.lessonNumber}_Study_Guide.pdf`);
}
