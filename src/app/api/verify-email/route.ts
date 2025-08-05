import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

export async function GET(req: Request) {
    /*
    after users clicks the verification link they've gotten on their email
    receives token and email from URL,
    hashes incoming token and checks online
    */
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email")?.trim().toLowerCase();
    if(!token || !email) {
        return NextResponse.json({ error: "Invalid request" }, {status:400});
    }

    //rehash the token
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const record = await prisma.verificationToken.findUnique({
        where: {token: tokenHash},
    });
    //checks if there is a token record, if email is on the record, and if token hasn't expired
    if(!record || record.identifier !== email || record.expires < new Date()) {
        return NextResponse.json({error: "Invalid or expired token"}, {status: 400});
    }
    
    //validate account in DB
    await prisma.user.update({
        where: {email},
        data: { emailVerified: new Date()},
    });

    //delete token, no longer necessary
    await prisma.verificationToken.delete({where: {token: tokenHash}});

    //redirect back to login
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return NextResponse.redirect(new URL(`${baseUrl}/login`));
}