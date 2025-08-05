import { randomBytes, createHash } from 'crypto';
import prisma from './prisma';
import { sendEmail } from './ses';

//sends new verification email and replaces existing tokens connected to the user
export async function sendVerificationEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // create token and store a hashed token with its expiration date
    const plainToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(plainToken).digest("hex");
    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // (minutes)*(seconds per minute)*(milliseconds per second).

    // create verification URL with token
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/verify-email?token=${plainToken}&email=${encodeURIComponent(normalizedEmail)}`;

    //sends email with the token url
    await sendEmail({
        to: normalizedEmail,
        subject: "Verify your email",
        html: `
            <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
            <p>Click the button below to verify your email address.</p>
            <p>This button will also lead you to back to the login portal.</p>

            <p>
                <a href="${verifyUrl}"
                style="display:inline-block;padding:10px 16px;border-radius:6px;background:#111;color:#fff;text-decoration:none">
                Verification Button
                </a>
            </p>
            <p>If the button doesn’t work, copy and paste this URL:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            </div>
        `,
    });

    // save token to DB after deleting old tokens if any
    // only store token after email successfully sends
    await prisma.$transaction(async (tx) =>{
        await tx.verificationToken.deleteMany({ where: {identifier: normalizedEmail } });

        await tx.verificationToken.create({
            data: {
                identifier: normalizedEmail,
                token: tokenHash,
                expires: tokenExpiration,
            },
        });
    });
}