'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setStatus(data.message || 'Check your email for the reset link.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot your password?</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and we’ll send you a link to reset it.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          {status && <p className="text-center text-sm text-gray-600 mt-2">{status}</p>}
        </form>
      </div>
    </div>
  );
}

