import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/']; // Add your protected routes here

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Not logged in trying to access protected route
  if (isProtected && !token && pathname !== '/login') { // change the !== login logic later on because it is saying all paths starting with / is protected.
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in trying to visit login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Run on all pages except static/API
  ],
};