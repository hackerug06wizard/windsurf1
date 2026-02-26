import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook for debugging
    console.log('Marzpay Webhook received:', body);
    
    // Validate webhook signature (if Marzpay provides one)
    // TODO: Implement signature validation if available
    
    const { 
      transaction, 
      collection, 
      status 
    } = body;

    // Process different transaction statuses
    switch (status) {
      case 'completed':
        await handleCompletedPayment(transaction, collection);
        break;
      case 'failed':
        await handleFailedPayment(transaction, collection);
        break;
      case 'cancelled':
        await handleCancelledPayment(transaction, collection);
        break;
      default:
        console.log('Unknown payment status:', status);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ status: 'received' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCompletedPayment(transaction: any, collection: any) {
  console.log(`Payment completed: ${transaction.uuid}`);
  
  // Here you can:
  // 1. Update order status in your database
  // 2. Send confirmation email to customer
  // 3. Update inventory
  // 4. Create shipping order
  // 5. Send notifications
  
  // For demo purposes, we'll store in a simple array
  // In production, use a proper database
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const newOrder = {
    id: transaction.uuid,
    customerName: 'Customer', // You'd get this from your order form
    customerEmail: 'customer@example.com', // You'd get this from your order form
    customerPhone: collection.phone_number,
    items: [], // You'd get this from your cart
    total: collection.amount.raw,
    status: 'completed',
    createdAt: new Date().toISOString(),
    provider: collection.provider,
    transactionReference: transaction.reference,
  };
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // TODO: Send email confirmation
  // TODO: Update inventory
  // TODO: Notify admin
}

async function handleFailedPayment(transaction: any, collection: any) {
  console.log(`Payment failed: ${transaction.uuid}`);
  
  // Here you can:
  // 1. Notify customer of payment failure
  // 2. Log the failure for analysis
  // 3. Offer alternative payment methods
  
  // TODO: Send failure notification
}

async function handleCancelledPayment(transaction: any, collection: any) {
  console.log(`Payment cancelled: ${transaction.uuid}`);
  
  // Here you can:
  // 1. Notify customer of cancellation
  // 2. Log the cancellation
  // 3. Offer to retry payment
  
  // TODO: Send cancellation notification
}

// GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
