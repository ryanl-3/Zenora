import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {sendVerificationEmail} from '@/lib/verify';

export async function POST(req: Request) {
    // if user clicks resend email, we validate the user can be sent an email again
    try {
        const { email } = await req.json();
        if (!email) {
        return NextResponse.json(
            { error: 'Email is required.' },
            { status: 400 }
        );
        }
        
        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check for user
        const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        });

        if (!user) {
        return NextResponse.json(
            { error: 'User not found.' },
            { status: 404 }
        );
        }
        
        if (user.emailVerified) {
            return NextResponse.json(
                {message: 'Email already verified' }, 
                {status: 200}
            );
        }

        await sendVerificationEmail(normalizedEmail);
        return NextResponse.json(
            { message: 'Verification email resent' }, 
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Resend error:', error);
        return NextResponse.json(
        { error: 'Failed to resend, try a different email.' },
        { status: 500 }
        );
  }
}
