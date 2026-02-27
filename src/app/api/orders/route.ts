import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types';

// Mock database - in production, this would be a real database
let orders: Order[] = [];

export async function GET(request: NextRequest) {
  try {
    // Return all orders
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.items || !orderData.customerName || !orderData.customerEmail || !orderData.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      items: orderData.items,
      total: orderData.total,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
