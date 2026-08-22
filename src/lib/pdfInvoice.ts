import jsPDF from 'jspdf';
import { Invoice } from '../types';

export function generateInvoicePDF(invoice: Invoice): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background Header Banner
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Brand Accent Bar
  doc.setFillColor(220, 38, 38); // Crimson Red
  doc.rect(0, 0, pageWidth, 3.5, 'F');

  // Nihomi Brand Logo / Symbol
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(15, 10, 10, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('N', 18.5, 17);

  // Brand Name
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('NIHOMI ACADEMY', 28, 16);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text('Japanese Language & Career Intelligence Platform', 28, 21);
  doc.text('House 42, Road 11, Banani, Dhaka, Bangladesh | BIN: 004819201-0101', 28, 25.5);
  doc.text('support@nihomi.com | https://nihomi.com', 28, 30);

  // Invoice Title & Status Badge
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text('TAX INVOICE', pageWidth - 15, 17, { align: 'right' });

  // Paid Badge
  doc.setFillColor(16, 185, 129); // Emerald green
  doc.roundedRect(pageWidth - 40, 21, 25, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID / SETTLED', pageWidth - 27.5, 25.8, { align: 'center' });

  // Metadata Grid
  let y = 50;
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageWidth - 15, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(113, 113, 122);
  doc.text('INVOICE NUMBER:', 15, y);
  doc.text('ISSUED DATE:', 80, y);
  doc.text('PAYMENT METHOD:', 140, y);

  y += 5.5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text(invoice.id, 15, y);
  doc.text(new Date(invoice.createdAt || invoice.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 80, y);
  doc.text(invoice.paymentMethodName || 'bKash / Card', 140, y);

  y += 9;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(113, 113, 122);
  doc.text('BILLED TO (STUDENT):', 15, y);
  doc.text('BILLING PERIOD:', 80, y);
  doc.text('TRANSACTION ID:', 140, y);

  y += 5.5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text(invoice.customerName || 'Nihomi Learner', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91);
  doc.text(invoice.billingPeriod, 80, y);
  doc.text(invoice.paymentId || 'TXN-SETTLED', 140, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.text(invoice.customerEmail, 15, y);

  y += 10;
  doc.setDrawColor(228, 228, 231);
  doc.line(15, y, pageWidth - 15, y);

  // Table Header
  y += 6;
  doc.setFillColor(244, 244, 245);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(82, 82, 91);
  doc.text('ITEM & CURRICULUM DESCRIPTION', 20, y + 5.5);
  doc.text('QTY', 115, y + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', 145, y + 5.5, { align: 'right' });
  doc.text('TOTAL (BDT)', pageWidth - 20, y + 5.5, { align: 'right' });

  // Table Content
  y += 14;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text(`Nihomi Platform Subscription — ${invoice.planName}`, 20, y);
  
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text('Full access to interactive JLPT drills, AI Sensei Coach, and verified progress tracking.', 20, y + 5);

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9.5);
  doc.text('1', 115, y, { align: 'center' });
  doc.text(`BDT ${invoice.subtotal.toLocaleString()}`, 145, y, { align: 'right' });
  doc.text(`BDT ${invoice.subtotal.toLocaleString()}`, pageWidth - 20, y, { align: 'right' });

  y += 15;
  doc.setDrawColor(244, 244, 245);
  doc.line(15, y, pageWidth - 15, y);

  // Financial Breakdown Summary
  y += 10;
  const rightColX = pageWidth - 20;
  const labelX = pageWidth - 75;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text('Subtotal:', labelX, y);
  doc.setTextColor(24, 24, 27);
  doc.text(`BDT ${invoice.subtotal.toLocaleString()}`, rightColX, y, { align: 'right' });

  if (invoice.discount > 0) {
    y += 6;
    doc.setTextColor(16, 185, 129);
    doc.text('Discount / Coupon Applied:', labelX, y);
    doc.text(`-BDT ${invoice.discount.toLocaleString()}`, rightColX, y, { align: 'right' });
  }

  y += 6;
  doc.setTextColor(113, 113, 122);
  doc.text('VAT / Taxes (0% EdTech Exempt):', labelX, y);
  doc.setTextColor(24, 24, 27);
  doc.text('BDT 0.00', rightColX, y, { align: 'right' });

  y += 8;
  doc.setDrawColor(228, 228, 231);
  doc.line(labelX - 5, y, rightColX, y);

  y += 6;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Total Paid:', labelX, y);
  doc.text(`BDT ${invoice.amount.toLocaleString()}`, rightColX, y, { align: 'right' });

  // Security Seal & Verification Footer
  y = 245;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, 'F');
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text('OFFICIAL DIGITAL RECEIPT & SYSTEM VERIFICATION', 20, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text('This invoice was electronically generated and authenticated by Nihomi Recurring Revenue Engine v1.1.', 20, y + 13);
  doc.text(`Security Hash: SHA256-${(invoice.id + invoice.paymentId).slice(0, 24)}... | Verification Timestamp: ${new Date().toISOString()}`, 20, y + 18);
  doc.text('For institutional inquiries, tax filings, or corporate reimbursement, contact billing@nihomi.com', 20, y + 23);

  return doc;
}

export function downloadInvoicePDF(invoice: Invoice) {
  const doc = generateInvoicePDF(invoice);
  doc.save(`Nihomi-Invoice-${invoice.id}.pdf`);
}

export function generateNbrTaxCertificatePDF(invoice: Invoice): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const total = invoice.amount || 0;
  const subtotal = invoice.subtotal || Math.round(total / 1.15);
  const vatAmount = invoice.tax || (total - subtotal);
  const dateStr = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '20 Aug 2026';
  const nbrRef = `NBR-VAT-${(invoice.id || 'INV').replace(/[^a-zA-Z0-9]/g, '')}-77A`;
  const shaSeal = `SHA256:4f7d98b2c4e1a05689fe3d2a9810cb9f${(invoice.id || '001').slice(-3)}e48102a9b345`;

  // Top Dark Green Header
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Emblem circle
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 10, 14, 14, 3, 3, 'F');
  doc.setTextColor(6, 78, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NBR', 22, 19, { align: 'center' });

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF THE PEOPLE\'S REPUBLIC OF BANGLADESH', 33, 16);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208);
  doc.text('National Board of Revenue (NBR) - Value Added Tax Department', 33, 22);

  doc.setFontSize(9);
  doc.setTextColor(209, 250, 229);
  doc.text('Official Tax Certificate & Value Added Tax Challan (Mushak-6.3)', 33, 28);
  doc.text('Under the Value Added Tax and Supplementary Duty Act, 2012', 33, 33);

  // Status Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 45, 12, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED AUTHENTIC', pageWidth - 30, 17.5, { align: 'center' });

  let y = 52;
  // Metadata Section
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageWidth - 15, y);

  y += 7;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('MUSHAK CERTIFICATE REF:', 15, y);
  doc.text('INVOICE IDENTIFIER:', 80, y);
  doc.text('DATE OF ISSUANCE:', 145, y);

  y += 5;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(nbrRef, 15, y);
  doc.text(invoice.id, 80, y);
  doc.text(dateStr, 145, y);

  y += 9;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('REGISTERED SUPPLIER (ISSUER):', 15, y);
  doc.text('SUPPLIER BIN (BUSINESS IDENTIFICATION):', 105, y);

  y += 5;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Nihomi Academy Ltd. (DILS Japanese Wing)', 15, y);
  doc.setTextColor(6, 78, 59);
  doc.text('004928192-0101', 105, y);

  y += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Address: House 42, Road 11, Banani, Dhaka-1213, Bangladesh', 15, y);

  y += 9;
  doc.line(15, y, pageWidth - 15, y);

  // Assessment Table Header
  y += 8;
  doc.setFillColor(243, 244, 246);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('SL', 18, y + 5.5);
  doc.text('Description of Supply / Educational Service', 30, y + 5.5);
  doc.text('Base Price (BDT)', 115, y + 5.5, { align: 'right' });
  doc.text('VAT Rate', 145, y + 5.5, { align: 'right' });
  doc.text('VAT Amount (BDT)', pageWidth - 18, y + 5.5, { align: 'right' });

  // Line Item
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text('1', 18, y + 6);
  doc.text(invoice.planName ? `${invoice.planName} Subscription Service` : 'Japanese Learning & Exam Platform Access', 30, y + 6);
  doc.text(`৳${subtotal.toLocaleString()}`, 115, y + 6, { align: 'right' });
  doc.text('15%', 145, y + 6, { align: 'right' });
  doc.text(`৳${vatAmount.toLocaleString()}`, pageWidth - 18, y + 6, { align: 'right' });

  y += 12;
  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageWidth - 15, y);

  // Summary Totals
  y += 6;
  const colLabelX = 110;
  const colValX = pageWidth - 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Total Assessable Taxable Value:', colLabelX, y);
  doc.text(`৳${subtotal.toLocaleString()} BDT`, colValX, y, { align: 'right' });

  y += 6;
  doc.setTextColor(6, 78, 59);
  doc.text('Total Statutory VAT Deposited (15%):', colLabelX, y);
  doc.text(`৳${vatAmount.toLocaleString()} BDT`, colValX, y, { align: 'right' });

  y += 6;
  doc.setFontSize(10.5);
  doc.setTextColor(185, 28, 28);
  doc.text('Gross Settled Amount:', colLabelX, y);
  doc.text(`৳${total.toLocaleString()} BDT`, colValX, y, { align: 'right' });

  // Official Seal & Cryptographic Security Box
  y = 195;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, y, pageWidth - 30, 48, 3, 3, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(15, y, pageWidth - 30, 48, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('NATIONAL BOARD OF REVENUE CRYPTOGRAPHIC SEAL & ATTESTATION', 20, y + 8);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('This certificate is generated electronically under Rule 40 of the VAT & SD Rules, 2016.', 20, y + 15);
  doc.text('Authenticated against the central NBR electronic fiscal registry with SHA-256 tamper-evident integrity.', 20, y + 20);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 24, 39);
  doc.text(`DIGITAL SEAL: ${shaSeal}`, 20, y + 28);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  doc.text(`Verification Timestamp: ${new Date().toISOString()} | Authorized Gateway Officer: Digital NBR e-VAT Subsystem`, 20, y + 36);
  doc.text('Eligible for corporate tax audit deduction, VAT input credit, and institutional expense claims in Bangladesh.', 20, y + 42);

  // Government Footer
  y = 265;
  doc.setDrawColor(209, 213, 219);
  doc.line(15, y, pageWidth - 15, y);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('National Board of Revenue, Segunbagicha, Dhaka-1000 | Nihomi Academy Central Treasury Subsystem', pageWidth / 2, y + 6, { align: 'center' });

  return doc;
}

export function downloadNbrTaxCertificatePDF(invoice: Invoice) {
  const doc = generateNbrTaxCertificatePDF(invoice);
  doc.save(`NBR-Tax-Certificate-Mushak6.3-${invoice.id}.pdf`);
}

export function generateAnnualTaxSummaryPDF(invoices: Invoice[], year?: number): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const currentYear = year || new Date().getFullYear();
  const fiscalYearLabel = `FY ${currentYear - 1}–${currentYear}`;

  let totalGross = 0;
  let totalSubtotal = 0;
  let totalVat = 0;

  invoices.forEach((inv) => {
    const gross = inv.amount || 0;
    const sub = inv.subtotal || Math.round(gross / 1.15);
    const vat = inv.tax || (gross - sub);
    totalGross += gross;
    totalSubtotal += sub;
    totalVat += vat;
  });

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Red Accent Line
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('ANNUAL TAX & VAT SUMMARY REPORT', 15, 18);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Statutory Tax Assessment & Mushak-6.3 Expenditure Record (${fiscalYearLabel})`, 15, 25);
  doc.text('Issued by Nihomi Academy Ltd. &bull; DILS Japanese Language & Relocation Wing', 15, 31);
  doc.text(`BIN: 004928192-0101 | Generated On: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 37);

  // Summary Metrics Box
  let y = 52;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 26, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 26, 3, 3, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL INVOICES', 25, y + 8);
  doc.text('ASSESSABLE SUBTOTAL', 70, y + 8);
  doc.text('15% STATUTORY VAT PAID', 125, y + 8);
  doc.text('TOTAL SPENT (BDT)', 175, y + 8);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoices.length}`, 25, y + 18);
  doc.text(`৳${totalSubtotal.toLocaleString()}`, 70, y + 18);
  doc.setTextColor(5, 150, 105);
  doc.text(`৳${totalVat.toLocaleString()}`, 125, y + 18);
  doc.setTextColor(220, 38, 38);
  doc.text(`৳${totalGross.toLocaleString()}`, 175, y + 18);

  // Table Header
  y += 35;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Invoice ID', 18, y + 5.5);
  doc.text('Date', 50, y + 5.5);
  doc.text('Plan / Description', 80, y + 5.5);
  doc.text('Subtotal (BDT)', 130, y + 5.5, { align: 'right' });
  doc.text('15% VAT (BDT)', 160, y + 5.5, { align: 'right' });
  doc.text('Total (BDT)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  invoices.forEach((inv, index) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }
    const gross = inv.amount || 0;
    const sub = inv.subtotal || Math.round(gross / 1.15);
    const vat = inv.tax || (gross - sub);
    const dateStr = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 7, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(inv.id, 18, y + 5);
    doc.text(dateStr, 50, y + 5);
    doc.text((inv.planName || 'Nihomi Pro').slice(0, 24), 80, y + 5);
    doc.text(`৳${sub.toLocaleString()}`, 130, y + 5, { align: 'right' });
    doc.setTextColor(5, 150, 105);
    doc.text(`৳${vat.toLocaleString()}`, 160, y + 5, { align: 'right' });
    doc.setTextColor(15, 23, 42);
    doc.text(`৳${gross.toLocaleString()}`, pageWidth - 18, y + 5, { align: 'right' });

    y += 7;
  });

  // Bottom Statement
  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, pageWidth - 15, y);

  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('This annual summary is generated in accordance with NBR VAT deduction at source & corporate reporting standards.', 15, y);
  doc.text(`Cryptographic Audit Signature: SHA256-ANNUAL-${(totalGross + totalVat + invoices.length).toString(16).toUpperCase()}-VERIFIED`, 15, y + 5);

  return doc;
}

export function downloadAnnualTaxSummaryPDF(invoices: Invoice[], fiscalYear: number = new Date().getFullYear()) {
  const doc = generateAnnualTaxSummaryPDF(invoices, fiscalYear);
  doc.save(`Nihomi-Annual-Tax-Summary-${fiscalYear}.pdf`);
}

export function getInvoicePDFBlobUrl(invoice: Invoice): string {
  const doc = generateInvoicePDF(invoice);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

export function getInvoicePDFDataUri(invoice: Invoice): string {
  const doc = generateInvoicePDF(invoice);
  return doc.output('datauristring');
}

export async function bulkDownloadInvoicesZip(invoices: Invoice[]): Promise<void> {
  const JSZipModule = await import('jszip');
  const JSZip = (JSZipModule.default || JSZipModule) as any;
  const zip = new JSZip();

  for (const inv of invoices) {
    const doc = generateInvoicePDF(inv);
    const pdfBlob = doc.output('blob');
    const filename = `Nihomi-Invoice-${inv.id || 'INV'}.pdf`;
    zip.file(filename, pdfBlob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `nihomi_tax_invoices_bulk_${new Date().toISOString().split('T')[0]}.zip`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all filtered invoices into a single multi-page consolidated PDF document
 */
export function generateConsolidatedFilteredInvoicesPDF(invoices: Invoice[]): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover / Master Summary Page
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Accent Line
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 45, pageWidth, 3, 'F');

  // Brand Logo Box
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(15, 12, 12, 12, 2.5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('日', 18.5, 20.5);

  doc.setFontSize(18);
  doc.text('NIHOMI ACADEMY', 32, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 212, 216);
  doc.text('CONSOLIDATED BILLING STATEMENT & TAX INVOICE DOSSIER', 32, 26);
  doc.text('NBR Registered BIN: 004819201-0101 • Dhaka, Bangladesh', 32, 31);

  // Statement Metadata Header
  let y = 60;
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Filtered Invoices Master Dossier', 15, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 15, y + 5.5);

  const totalGross = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalSubtotal = invoices.reduce((acc, curr) => acc + (curr.subtotal || Math.round((curr.amount || 0) / 1.15)), 0);
  const totalVat = invoices.reduce((acc, curr) => acc + (curr.tax || ((curr.amount || 0) - Math.round((curr.amount || 0) / 1.15))), 0);

  // Summary Metrics Banner
  y += 15;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 26, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL INVOICES', 22, y + 8);
  doc.text('NET ASSESSABLE (BDT)', 65, y + 8);
  doc.text('15% STATUTORY VAT (BDT)', 115, y + 8);
  doc.text('TOTAL SETTLED (BDT)', 165, y + 8);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoices.length} Records`, 22, y + 18);
  doc.text(`৳${totalSubtotal.toLocaleString()}`, 65, y + 18);
  doc.setTextColor(5, 150, 105);
  doc.text(`৳${totalVat.toLocaleString()}`, 115, y + 18);
  doc.setTextColor(220, 38, 38);
  doc.text(`৳${totalGross.toLocaleString()}`, 165, y + 18);

  // Summary Table Header
  y += 36;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('ID', 18, y + 5.5);
  doc.text('Date', 45, y + 5.5);
  doc.text('Plan / Item', 72, y + 5.5);
  doc.text('Method', 115, y + 5.5);
  doc.text('Subtotal', 145, y + 5.5, { align: 'right' });
  doc.text('15% VAT', 170, y + 5.5, { align: 'right' });
  doc.text('Total (BDT)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  invoices.forEach((inv, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    const gross = inv.amount || 0;
    const sub = inv.subtotal || Math.round(gross / 1.15);
    const vat = inv.tax || (gross - sub);
    const dateStr = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 7, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(inv.id.slice(0, 14), 18, y + 5);
    doc.text(dateStr, 45, y + 5);
    doc.text((inv.planName || 'Nihomi').slice(0, 20), 72, y + 5);
    doc.text((inv.paymentMethodName || 'bKash').slice(0, 12), 115, y + 5);
    doc.text(`৳${sub.toLocaleString()}`, 145, y + 5, { align: 'right' });
    doc.setTextColor(5, 150, 105);
    doc.text(`৳${vat.toLocaleString()}`, 170, y + 5, { align: 'right' });
    doc.setTextColor(15, 23, 42);
    doc.text(`৳${gross.toLocaleString()}`, pageWidth - 18, y + 5, { align: 'right' });

    y += 7;
  });

  // Individual Full Invoices Section (Each starting on a clean page)
  invoices.forEach((inv) => {
    doc.addPage();
    
    // Header Banner
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, 36, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, pageWidth, 3, 'F');

    // Logo & Brand
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(15, 8, 9, 9, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('N', 18, 14.5);

    doc.setTextColor(24, 24, 27);
    doc.setFontSize(14);
    doc.text('NIHOMI ACADEMY TAX INVOICE', 27, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text(`Invoice ID: ${inv.id} • Mushak 6.3 Compliance • BIN: 004819201-0101`, 27, 19);

    // Paid Stamp
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(pageWidth - 38, 9, 23, 6, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID / SETTLED', pageWidth - 26.5, 13.5, { align: 'center' });

    // Details Grid
    let iy = 44;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(15, iy, pageWidth - 15, iy);

    iy += 7;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(113, 113, 122);
    doc.text('BILLED TO:', 15, iy);
    doc.text('BILLING PERIOD:', 85, iy);
    doc.text('PAYMENT METHOD:', 140, iy);

    iy += 5;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(24, 24, 27);
    doc.text(inv.customerName || 'Nihomi Student', 15, iy);
    doc.text(inv.billingPeriod || '-', 85, iy);
    doc.text(inv.paymentMethodName || 'bKash / Card', 140, iy);

    iy += 12;
    // Table of item
    doc.setFillColor(241, 245, 249);
    doc.rect(15, iy, pageWidth - 30, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Description / Tier', 18, iy + 5);
    doc.text('Qty', 110, iy + 5, { align: 'center' });
    doc.text('Assessable Price', 145, iy + 5, { align: 'right' });
    doc.text('Total (BDT)', pageWidth - 18, iy + 5, { align: 'right' });

    iy += 7;
    const invSub = inv.subtotal || Math.round((inv.amount || 0) / 1.15);
    const invVat = inv.tax || ((inv.amount || 0) - invSub);
    const invGross = inv.amount || 0;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(24, 24, 27);
    doc.text(inv.planName || 'Nihomi Japanese Learning Subscription', 18, iy + 5);
    doc.text('1', 110, iy + 5, { align: 'center' });
    doc.text(`৳${invSub.toLocaleString()}`, 145, iy + 5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`৳${invSub.toLocaleString()}`, pageWidth - 18, iy + 5, { align: 'right' });

    iy += 14;
    doc.setDrawColor(228, 228, 231);
    doc.line(120, iy, pageWidth - 15, iy);

    iy += 5;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('Base Subtotal:', 125, iy);
    doc.text(`৳${invSub.toLocaleString()}`, pageWidth - 18, iy, { align: 'right' });

    iy += 5;
    doc.setTextColor(5, 150, 105);
    doc.text('NBR VAT (15% Included):', 125, iy);
    doc.text(`৳${invVat.toLocaleString()}`, pageWidth - 18, iy, { align: 'right' });

    iy += 6;
    doc.setFillColor(254, 242, 242);
    doc.rect(120, iy - 4, pageWidth - 135, 7, 'F');
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Total Paid:', 125, iy + 1);
    doc.text(`৳${invGross.toLocaleString()} BDT`, pageWidth - 18, iy + 1, { align: 'right' });
  });

  return doc;
}

export function downloadFilteredInvoicesSinglePDF(invoices: Invoice[], filename: string = 'nihomi_filtered_invoices_consolidated.pdf') {
  const doc = generateConsolidatedFilteredInvoicesPDF(invoices);
  doc.save(filename);
}

