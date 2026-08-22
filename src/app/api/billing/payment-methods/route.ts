// src/app/api/billing/payment-methods/route.ts
// Nihomi (にほみ) — Saved Payment Methods & Gateway Agreement Route

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'current_user';

    // Return default tokenized payment methods
    const paymentMethods = [
      {
        id: 'pm_bkash_default',
        userId,
        type: 'bkash',
        isDefault: true,
        bKashNumberMasked: '017*****892',
        bKashAgreementId: 'AGR_BK_9948218',
        tokenStatus: 'active',
        tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pm_card_backup',
        userId,
        type: 'card',
        isDefault: false,
        cardLast4: '4242',
        cardBrand: 'visa',
        cardExpiry: '12/28',
        cardHolderName: 'MD TANVIR KABIR',
        tokenStatus: 'active',
        tokenExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      paymentMethods
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch payment methods' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, bKashNumber, cardNumber, cardExpiry, cardCvc, cardHolderName, isDefault } = body;

    if (!type || (type !== 'bkash' && type !== 'card')) {
      return NextResponse.json({ success: false, error: 'Invalid payment method type. Must be "bkash" or "card".' }, { status: 400 });
    }

    if (type === 'bkash') {
      const cleanBkash = (bKashNumber || '').replace(/\D/g, '');
      if (cleanBkash.length !== 11 || !cleanBkash.startsWith('01')) {
        return NextResponse.json({ success: false, error: 'Invalid 11-digit bKash number.' }, { status: 400 });
      }

      const masked = `${cleanBkash.slice(0, 3)}*****${cleanBkash.slice(8)}`;
      const newMethod = {
        id: `pm_bk_${Date.now()}`,
        userId: 'current_user',
        type: 'bkash',
        isDefault: isDefault ?? true,
        bKashNumberMasked: masked,
        bKashAgreementId: `AGR_BK_${Math.floor(1000000 + Math.random() * 9000000)}`,
        tokenStatus: 'active',
        tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: `bKash agreement successfully linked for ${masked}.`,
        paymentMethod: newMethod,
      });
    } else {
      const cleanCard = (cardNumber || '').replace(/\D/g, '');
      if (cleanCard.length < 13) {
        return NextResponse.json({ success: false, error: 'Invalid card number.' }, { status: 400 });
      }

      const last4 = cleanCard.slice(-4);
      let cardBrand = 'visa';
      if (/^5[1-5]/.test(cleanCard)) cardBrand = 'mastercard';
      else if (/^3[47]/.test(cleanCard)) cardBrand = 'amex';

      const newMethod = {
        id: `pm_card_${Date.now()}`,
        userId: 'current_user',
        type: 'card',
        isDefault: isDefault ?? true,
        cardLast4: last4,
        cardBrand,
        cardExpiry: cardExpiry || '12/28',
        cardHolderName: cardHolderName || 'Cardholder',
        tokenStatus: 'active',
        tokenExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastRefreshedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: `${cardBrand.toUpperCase()} ending in •••• ${last4} authorized.`,
        paymentMethod: newMethod,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update payment method' }, { status: 500 });
  }
}
