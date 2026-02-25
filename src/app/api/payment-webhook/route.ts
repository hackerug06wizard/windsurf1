import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook data for debugging
    console.log('Payment webhook received:', body);
    
    // In a real implementation, you would:
    // 1. Verify the webhook signature (if Marzpay provides one)
    // 2. Update order status in your database
    // 3. Send confirmation email to customer
    // 4. Update inventory
    
    // Example webhook structure from Marzpay might include:
    // - transaction_id
    // - reference (your order ID)
    // - status (completed, failed, pending)
    // - amount
    // - phone_number
    
    const { reference, status, transaction_id, amount } = body;
    
    if (status === 'completed') {
      // Payment successful
      console.log(`Payment completed for order ${reference}, transaction ID: ${transaction_id}`);
      
      // Here you would typically:
      // 1. Find the order by reference
      // 2. Update order status to 'paid'
      // 3. Send confirmation email
      // 4. Notify admin
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully' 
      });
    } else if (status === 'failed') {
      // Payment failed
      console.log(`Payment failed for order ${reference}`);
      
      // Handle failed payment
      return NextResponse.json({ 
        success: false, 
        message: 'Payment failed' 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received' 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid webhook data' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Marzpay webhook endpoint' 
  });
}
