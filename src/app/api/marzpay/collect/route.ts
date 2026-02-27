import { NextRequest, NextResponse } from 'next/server';
import { createCollection } from '@/lib/marzpay';

export const runtime = 'edge'; // This makes it an Edge Function

export async function POST(request: NextRequest) {
  try {
    const { amount, phone_number, description } = await request.json();
    
    // Validate input
    if (!amount || !phone_number) {
      return NextResponse.json(
        { success: false, error: 'Amount and phone number are required' },
        { status: 400 }
      );
    }

    // Create Marzpay collection
    const result = await createCollection({
      amount,
      phone_number,
      country: 'UG',
      reference: '', // Will be generated automatically
      description: description || 'Payment for Mami Papa Babies & Kids products',
      callback_url: 'https://mami-papa-store.onrender.com/api/payment-webhook',
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Marzpay collection error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
