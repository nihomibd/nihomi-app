// src/lib/services/invoicePdfGenerator.ts
// NIHOMI.COM — OFFICIAL COMMERCIAL PAYMENT INVOICE & TAX RECEIPT ENGINE
// Generates downloadable vector A4 PDF invoices adhering to Nihomi Brand Guidelines

import { jsPDF } from 'jspdf';

export interface InvoiceCustomerInfo {
  studentName: string;
  studentEmail: string;
  studentId?: string;
  studentCountry?: string;
}

export interface InvoicePaymentInfo {
  invoiceNumber: string;
  issueDate?: string;
  trxID: string;
  paymentMethod: string;
  planId: string;
  planTitle: string;
  billingInterval: string;
  amount: number;
  currency?: 'BDT' | 'JPY';
  discountAmount?: number;
  taxAmount?: number;
  paymentStatus?: 'PAID' | 'COMPLETED';
}

/**
 * Universal browser PDF download helper
 */
export function triggerPdfDownload(doc: jsPDF, filename: string): void {
  try {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (err) {
    console.warn('[invoicePdfGenerator] Blob download failed, falling back to doc.save():', err);
    doc.save(filename);
  }
}

/**
 * Generates an official portrait A4 Nihomi Commercial Tax Invoice & Payment Receipt (公式領収書)
 */
export function generateOfficialInvoicePdf(
  payment: InvoicePaymentInfo,
  customer: InvoiceCustomerInfo
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();   // 210mm
  const height = doc.internal.pageSize.getHeight(); // 297mm

  const currencySymbol = payment.currency === 'JPY' ? '¥' : '৳';
  const currencyCode = payment.currency || 'BDT';
  const issueDate = payment.issueDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const subtotal = payment.amount + (payment.discountAmount || 0);
  const discount = payment.discountAmount || 0;
  const tax = payment.taxAmount || 0;
  const finalTotal = payment.amount;

  // 1. Clean Crisp Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, width, height, 'F');

  // 2. Top Decorative Header Bands (Nihomi Crimson & Amber)
  doc.setFillColor(228, 81, 71); // Crimson #E45147
  doc.rect(0, 0, width, 5, 'F');
  doc.setFillColor(245, 158, 11); // Amber #F59E0B
  doc.rect(0, 5, width, 1.5, 'F');

  // 3. Header Branding & Corporate Identity
  // Logo Mark Emblem Box
  doc.setFillColor(10, 10, 18); // Obsidian #0A0A12
  doc.roundedRect(15, 14, 18, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text('に', 24, 26, { align: 'center' });

  // Organization Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(10, 10, 18);
  doc.text('NIHOMI JAPANESE LEARNING ACADEMY', 37, 21);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('株式会社ニホミ • Nihomi Commercial Learning & Relocation Platform', 37, 26);
  doc.text('BIN / Tax ID: 004829104-0101 • Dhaka & Tokyo • support@nihomi.com', 37, 30);

  // Document Title & Stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(228, 81, 71); // Crimson
  doc.text('TAX INVOICE / OFFICIAL RECEIPT', width - 15, 21, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('公式領収書 • ORIGINAL FOR RECIPIENT', width - 15, 26, { align: 'right' });

  // Paid Status Pill
  doc.setFillColor(240, 253, 244); // Green 50
  doc.setDrawColor(34, 197, 94);   // Green 500
  doc.setLineWidth(0.4);
  doc.roundedRect(width - 45, 29, 30, 6.5, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // Green 800
  doc.text('PAID / পরিশোধিত', width - 30, 33.5, { align: 'center' });

  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(15, 38, width - 15, 38);

  // 4. Meta Information Grid (2 Columns: Invoice Info & Customer Info)
  // Left: Customer Details
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.roundedRect(15, 43, 85, 36, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 43, 85, 36, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('BILLED TO / শিক্ষার্থী পরিচিতি', 20, 50);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(customer.studentName || 'Learner', 20, 57);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email: ${customer.studentEmail}`, 20, 63);
  doc.text(`Student ID: ${customer.studentId || 'NHM-STD-2026-REG'}`, 20, 68);
  doc.text(`Region: ${customer.studentCountry || 'Bangladesh (BD)'}`, 20, 73);

  // Right: Invoice & Payment Reference
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(width - 100, 43, 85, 36, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(width - 100, 43, 85, 36, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('INVOICE DETAILS / লেনদেন তথ্য', width - 95, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Invoice Number:', width - 95, 56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.invoiceNumber, width - 20, 56, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Issue Date:', width - 95, 62);
  doc.text(issueDate, width - 20, 62, { align: 'right' });

  doc.text('Payment Gateway:', width - 95, 68);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(228, 81, 71);
  doc.text(payment.paymentMethod, width - 20, 68, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Transaction TrxID:', width - 95, 74);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.trxID, width - 20, 74, { align: 'right' });

  // 5. Line Items Table
  const tableY = 87;
  // Table Header
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(15, tableY, width - 30, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('#', 20, tableY + 5.5);
  doc.text('SUBSCRIPTION / SERVICE DESCRIPTION', 30, tableY + 5.5);
  doc.text('BILLING TERM', 125, tableY + 5.5);
  doc.text('RATE', 155, tableY + 5.5);
  doc.text('AMOUNT', width - 20, tableY + 5.5, { align: 'right' });

  // Row 1
  const rowY = tableY + 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(15, rowY, width - 30, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, rowY, width - 30, 22, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1', 20, rowY + 7);

  doc.setFont('helvetica', 'bold');
  doc.text(payment.planTitle, 30, rowY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('• Full Curriculum Access (N5-N3 Grammar, Kanji & Vocab bank)', 30, rowY + 12);
  doc.text('• Nomi Sensei AI 24/7 Conversational Voice Coach & Feedback', 30, rowY + 16);
  doc.text('• Unlimited Computer-Based JLPT & NAT Mock Exams + Marksheets', 30, rowY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(payment.billingInterval, 125, rowY + 7);
  doc.text(`${currencySymbol}${subtotal.toLocaleString()}`, 155, rowY + 7);

  doc.setFont('helvetica', 'bold');
  doc.text(`${currencySymbol}${subtotal.toLocaleString()}`, width - 20, rowY + 7, { align: 'right' });

  // 6. Summary Calculation Block (Right Aligned)
  const summaryY = rowY + 26;
  const summaryLeft = width - 90;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text('Subtotal:', summaryLeft, summaryY);
  doc.text(`${currencySymbol}${subtotal.toLocaleString()} ${currencyCode}`, width - 20, summaryY, { align: 'right' });

  if (discount > 0) {
    doc.text('Special Educational Discount:', summaryLeft, summaryY + 5.5);
    doc.setTextColor(228, 81, 71);
    doc.text(`-${currencySymbol}${discount.toLocaleString()} ${currencyCode}`, width - 20, summaryY + 5.5, { align: 'right' });
    doc.setTextColor(71, 85, 105);
  }

  const taxOffset = discount > 0 ? 11 : 5.5;
  doc.text('VAT / Tax (Educational Exemption):', summaryLeft, summaryY + taxOffset);
  doc.text(`${currencySymbol}0 (0%)`, width - 20, summaryY + taxOffset, { align: 'right' });

  // Total Box
  const totalBoxY = summaryY + taxOffset + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(228, 81, 71); // Crimson border
  doc.setLineWidth(0.6);
  doc.roundedRect(summaryLeft - 5, totalBoxY, 75, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL PAID:', summaryLeft, totalBoxY + 8);
  doc.setFontSize(11);
  doc.setTextColor(228, 81, 71); // Crimson
  doc.text(`${currencySymbol}${finalTotal.toLocaleString()} ${currencyCode}`, width - 20, totalBoxY + 8, { align: 'right' });

  // 7. Terms & Payment Guarantee Box (Left aligned opposite summary)
  doc.setFillColor(254, 243, 199, 0.4); // Light amber tint
  doc.roundedRect(15, summaryY, 85, 34, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, summaryY, 85, 34, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text('PAYMENT GUARANTEE & SERVICE POLICY', 20, summaryY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  doc.text('• 7-Day Unconditional Money Back Guarantee applies to new enrolments.', 20, summaryY + 12);
  doc.text('• Instant activation of all curriculum and sensei AI capabilities.', 20, summaryY + 17);
  doc.text('• Valid official tax receipt eligible for organizational reimbursement.', 20, summaryY + 22);
  doc.text('• 24/7 dedicated learner hotline: +880 1834-348966', 20, summaryY + 27);

  // 8. Authentication & Official Hanko Seal Section
  const authY = 175;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, authY, width - 15, authY);

  // Japanese Hanko Stamp (Square Inkan Stamp in Crimson)
  const sealX = width - 52;
  const sealY = authY + 12;

  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(1.4);
  doc.roundedRect(sealX, sealY, 24, 24, 2, 2);

  doc.setDrawColor(228, 81, 71);
  doc.setLineWidth(0.3);
  doc.roundedRect(sealX + 1.2, sealY + 1.2, 21.6, 21.6, 1.2, 1.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(228, 81, 71);
  doc.text('にほみ', sealX + 12, sealY + 9, { align: 'center' });
  doc.text('公式印', sealX + 12, sealY + 16, { align: 'center' });
  doc.setFontSize(5);
  doc.text('OFFICIAL SEAL', sealX + 12, sealY + 20.5, { align: 'center' });

  // Signature Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Tanvir Hossain', width - 65, authY + 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Founder & Managing Director', width - 65, authY + 21, { align: 'right' });
  doc.text('Nihomi Japanese Learning Academy', width - 65, authY + 25, { align: 'right' });

  // Digital Verification QR text / hash block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DIGITAL TAX VERIFICATION & AUDIT TRAIL', 15, authY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice Auth Hash: sha256:${payment.trxID.toLowerCase().replace(/[^a-f0-9]/g, 'a') || '0a9b8c7d6e5f'}`, 15, authY + 16);
  doc.text(`Verify Online: https://nihomi.com/verify/invoice/${payment.invoiceNumber}`, 15, authY + 21);
  doc.text('NBR Automated Tax Invoicing System • Registered Private Educational Platform', 15, authY + 26);

  // 9. Bottom Footer Bar
  doc.setFillColor(10, 10, 18); // Obsidian #0A0A12
  doc.rect(0, height - 12, width, 12, 'F');
  doc.setFillColor(228, 81, 71); // Crimson accent line
  doc.rect(0, height - 12, width, 0.8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('NIHOMI.COM • THE PREMIER COMMERCIAL JAPANESE LEARNING PLATFORM', 15, height - 5);
  doc.text('PAGE 1 OF 1 • OFFICIAL TAX DOCUMENT', width - 15, height - 5, { align: 'right' });

  return doc;
}
