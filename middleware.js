// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const phoneNumber = request.cookies.get('phoneNumber')?.value;


  if (pathname.startsWith('/admin')) {

    if (!phoneNumber) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (phoneNumber !== '09123456789') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/login')) {
    if (phoneNumber) {
      return NextResponse.redirect(
        new URL(phoneNumber === '09123456789' ? '/admin' : '/', request.url)
      );
    }
  }

  return NextResponse.next();
}