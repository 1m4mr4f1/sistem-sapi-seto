// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // 1. Jika akses halaman login tapi sudah punya token -> Redirect ke Dashboard
  if (url.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Jika akses root (/) -> Redirect ke Login (atau Dashboard jika sudah login)
  if (url.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Jika akses halaman dashboard/* tapi TIDAK punya token -> Redirect ke Login
  if (url.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Tentukan path mana saja yang kena middleware ini
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};