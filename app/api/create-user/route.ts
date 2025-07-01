import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createUser } from '@/lib/actions/user.actions';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userData = await req.json();
    
    // Check if user already exists
    await connectToDatabase();
    const existingUser = await User.findOne({ clerkId: userId });
    
    if (existingUser) {
      return NextResponse.json({ success: true, user: existingUser, message: 'User already exists' });
    }
    
    // Create new user
    const newUser = await createUser({
      clerkId: userId,
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photo: userData.photo
    });
    
    return NextResponse.json({ success: true, user: newUser, message: 'User created' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}