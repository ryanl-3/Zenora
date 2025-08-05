'use client';
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email')?.trim().toLowerCase();
    const [status,setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const resend = async () => {
        if (!email) return;
        setStatus('sending');
        //calls the API route after the button is clicked
        try {
            //sends 
            const res = await fetch('/api/verify-email/resend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            });

            if (res.ok) {
            setStatus('sent');
            } else {
            setStatus('error');
            }
        } catch (e) {
        setStatus('error');
        }
    };

   return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Verify Your Email</h1>
      <p className="mb-4">
        Check to see if you have received a verification link sent to <strong>{email}</strong>.
        <br></br>
        If not, click below to resend a verification email
      </p>

      {status === 'sent' && <p className="text-green-600 mb-4">Verification email resent!</p>}
      {status === 'error' && <p className="text-red-600 mb-4">Failed to resend. Try again.</p>}

      <button
        onClick={resend}
        disabled={status === 'sending' || !email}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {status === 'sending' ? 'Resending...' : 'Resend Email'}
      </button>
    </div>
  );
}