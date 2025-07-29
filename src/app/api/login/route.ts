import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const res = NextResponse.json({ message: 'Login successful' });
  res.headers.set(
    'Set-Cookie',
    serialize('session_user', user.email, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    })
  );

  return res;
}
