// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  // Clear the cookie
  response.headers.set(
    'Set-Cookie',
    serialize('session_user', '', {
      path: '/',
      maxAge: 0,
    })
  );

  return response;
}
