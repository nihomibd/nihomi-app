// src/app/api/invoices/[id]/download/route.ts
// Nihomi (にほみ) — Secure Invoice PDF Download Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateInvoicePdfBuffer } from '@/lib/billing/invoicePdfGenerator';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { user: true, payment: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const pdfBuffer = await generateInvoicePdfBuffer({
    invoiceNumber: invoice.invoiceNumber,
    issuedAt: invoice.issuedAt,
    paidAt: invoice.paidAt,
    customerName: invoice.user?.name || 'Nihomi Learner',
    customerEmail: invoice.user?.email || '',
    planName: invoice.planName,
    billingInterval: invoice.billingInterval,
    billingPeriodStart: invoice.billingPeriodStart,
    billingPeriodEnd: invoice.billingPeriodEnd,
    subtotal: Number(invoice.subtotal),
    discountAmount: Number(invoice.discountAmount),
    totalAmount: Number(invoice.totalAmount),
    currency: invoice.currency,
    paymentMethod: invoice.payment?.paymentMethod || 'bKash Online',
    transactionId: invoice.payment?.providerTransactionId || 'N/A',
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
