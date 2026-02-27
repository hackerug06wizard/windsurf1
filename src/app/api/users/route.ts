import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

// Mock database - in production, this would be a real database
let users: User[] = [];

export async function GET(request: NextRequest) {
  try {
    // Return all users (admin only)
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password || !userData.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, hash this password
      phone: userData.phone,
      isAdmin: userData.isAdmin || false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
