import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Mock database - in production, this would be a real database
let products: Product[] = [];

export async function GET(request: NextRequest) {
  try {
    // Return all products
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name,
      price: productData.price,
      image: productData.image || '/api/placeholder/300/300',
      description: productData.description,
      category: productData.category,
      inStock: productData.inStock ?? true,
      age: productData.age,
      size: productData.size,
      color: productData.color,
    };

    products.push(newProduct);
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
