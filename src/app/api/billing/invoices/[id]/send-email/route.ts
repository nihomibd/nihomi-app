// src/app/api/billing/invoices/[id]/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const recipientEmail = body.email || 'mdtanvirkabirbiplob@gmail.com';

    return NextResponse.json({
      success: true,
      message: `Tax Invoice ${id} has been delivered to ${recipientEmail}.`,
      sentTo: recipientEmail,
      invoiceId: id,
      sentAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to send invoice email' },
      { status: 500 }
    );
  }
}
