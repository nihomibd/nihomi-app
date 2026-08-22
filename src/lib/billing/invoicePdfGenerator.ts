// src/lib/billing/invoicePdfGenerator.ts
// Nihomi (にほみ • Learn & Work) — Official PDF Invoice Generation Engine

import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export interface InvoicePdfData {
  invoiceNumber: string;
  issuedAt: Date;
  paidAt: Date | null;
  customerName: string;
  customerEmail: string;
  planName: string;
  billingInterval: 'monthly' | 'yearly';
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
}

export function generateInvoicePdfBuffer(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const brandRed = '#E11D48'; // Rose-600
    const darkSlate = '#0F172A'; // Slate-900
    const textGray = '#64748B'; // Slate-500

    // Header Logo & Branding
    doc.fillColor(brandRed).fontSize(22).font('Helvetica-Bold').text('Nihomi.com', 40, 45);
    doc.fillColor(textGray).fontSize(9).font('Helvetica').text('にほみ • Learn & Work in Japan', 40, 70);
    doc.text('Dhaka, Bangladesh | billing@nihomi.com', 40, 82);

    // Invoice Meta
    doc.fillColor(darkSlate).fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', 380, 45, { align: 'right' });
    doc.fillColor(brandRed).fontSize(10).font('Helvetica-Bold').text(`#${data.invoiceNumber}`, 380, 65, { align: 'right' });

    // Paid Watermark Stamp
    doc.rect(460, 85, 95, 20).fill('#DCFCE7');
    doc.fillColor('#15803D').fontSize(9).font('Helvetica-Bold').text('VERIFIED PAID', 460, 90, { width: 95, align: 'center' });

    doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, 120).lineTo(555, 120).stroke();

    // Customer & Payment Info
    doc.fillColor(textGray).fontSize(8).font('Helvetica-Bold').text('BILLED TO:', 40, 135);
    doc.fillColor(darkSlate).fontSize(10).font('Helvetica-Bold').text(data.customerName, 40, 148);
    doc.fillColor(textGray).fontSize(9).font('Helvetica').text(data.customerEmail, 40, 162);

    doc.fillColor(textGray).fontSize(8).font('Helvetica-Bold').text('INVOICE DATE:', 260, 135);
    doc.fillColor(darkSlate).fontSize(9).font('Helvetica').text(format(data.issuedAt, 'MMMM dd, yyyy'), 260, 148);

    doc.fillColor(textGray).fontSize(8).font('Helvetica-Bold').text('PAYMENT DETAILS:', 420, 135);
    doc.fillColor(darkSlate).fontSize(9).font('Helvetica').text(`${data.paymentMethod} (${data.transactionId})`, 420, 148, { width: 135 });

    // Table Header
    const tableTop = 205;
    doc.rect(40, tableTop, 515, 24).fill('#F8FAFC');
    doc.fillColor(darkSlate).fontSize(9).font('Helvetica-Bold');
    doc.text('DESCRIPTION', 50, tableTop + 7);
    doc.text('INTERVAL', 280, tableTop + 7);
    doc.text('AMOUNT (BDT)', 460, tableTop + 7, { align: 'right', width: 85 });

    // Table Row
    const rowTop = tableTop + 34;
    doc.fillColor(darkSlate).fontSize(10).font('Helvetica-Bold').text(`Nihomi ${data.planName} Plan`, 50, rowTop);
    doc.fillColor(textGray).fontSize(8).font('Helvetica').text(
      `Access Period: ${format(data.billingPeriodStart, 'MMM dd, yyyy')} - ${format(data.billingPeriodEnd, 'MMM dd, yyyy')}`,
      50,
      rowTop + 14
    );

    doc.fillColor(darkSlate).fontSize(9).font('Helvetica').text(data.billingInterval.toUpperCase(), 280, rowTop);
    doc.fontSize(9).font('Helvetica-Bold').text(`৳${data.subtotal.toLocaleString()}`, 460, rowTop, { width: 85, align: 'right' });

    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, rowTop + 35).lineTo(555, rowTop + 35).stroke();

    // Summary Section
    const summaryTop = rowTop + 55;
    doc.fillColor(textGray).fontSize(9).font('Helvetica').text('Subtotal:', 380, summaryTop);
    doc.fillColor(darkSlate).text(`৳${data.subtotal.toLocaleString()}`, 460, summaryTop, { align: 'right', width: 85 });

    if (data.discountAmount > 0) {
      doc.fillColor(brandRed).text('Discount Applied:', 380, summaryTop + 16);
      doc.text(`- ৳${data.discountAmount.toLocaleString()}`, 460, summaryTop + 16, { align: 'right', width: 85 });
    }

    doc.rect(370, summaryTop + 35, 185, 28).fill('#FFF1F2');
    doc.fillColor(brandRed).fontSize(11).font('Helvetica-Bold').text('Total Paid:', 380, summaryTop + 43);
    doc.text(`৳${data.totalAmount.toLocaleString()}`, 460, summaryTop + 43, { align: 'right', width: 85 });

    // Footer
    doc.fillColor(textGray).fontSize(8).font('Helvetica').text(
      'Thank you for studying with Nihomi.com (にほみ). This is an official computer-generated invoice.',
      40,
      740,
      { align: 'center', width: 515 }
    );

    doc.end();
  });
}
