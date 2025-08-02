import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/ses";

export async function GET() {
  try {
    await sendEmail({
      to: process.env.MAIL_DEV_RECIPIENT ?? process.env.SES_FROM_ADDRESS!, // must be verified in sandbox
      subject: "SES test",
      text: "If you see this, SES is working from this project.",
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("SES test failed:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}