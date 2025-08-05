import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/ses'; // or nodemailer
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
    return NextResponse.json({ message: 'If the email exists, a reset link was sent.' });
    }

    const token = uuid();
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
    where: { email },
    data: {
        resetToken: token,
        resetTokenExpiry: tokenExpires,
    },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log("Reset link being generated:", resetLink);
    await sendEmail({
        to: email, 
        subject:"Reset your password", 
        text: `To reset your password, click the link below:\n${resetLink}\n\nThis link will expire in 1 hour.`,
        html: `<p>To reset your password, <a href="${resetLink}">click here</a>.</p> <p>This link will expire in 1 hour.</p>`
    });

    return NextResponse.json({ message: 'Reset email sent.' });
}
