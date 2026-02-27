import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

// Mock database - in production, this would be a real database
let users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      data: {
        user: userWithoutPassword,
        token: 'mock-jwt-token' // In production, use real JWT
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
