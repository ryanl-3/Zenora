import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/verify';


//register
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }
    
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    const validName = name?.trim() || null;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: validName,
      },
      select: {id: true, email: true, name:true},
    });
    
    //sends email with the token url
    try {
      await sendVerificationEmail(user.email);
      return NextResponse.json(
        {
          message: 'User registered successfully.',
          user: { id: user.id, email: user.email, name: user.name },
          redirectTo: `/verify-email?email=${encodeURIComponent(user.email)}`,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);

      // Clean up user if verification failed
      try {
        await prisma.user.delete({ where: { id: user.id } });
      } catch (cleanupError) {
        console.error('Failed to delete user after email failure:', cleanupError);
      }

      // Ensure response is JSON
      return NextResponse.json(
        {
          error: 'Verification email failed. Try again with another email.',
        },
        { status: 500 }
      );
    }

    // return NextResponse.json(
    //   {
    //     message: 'User registered successfully.',
    //     user: { id: user.id, email: user.email, name: user.name },
    //   },
    //   { status: 201 }
    // );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
