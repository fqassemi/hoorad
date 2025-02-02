// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const phoneNumber = request.cookies.get('phoneNumber')?.value;

  
  const adminPhoneNumbers = ['09123456789', '09394540361', '09128093638'];

  if (pathname.startsWith('/admin')) {
    
    if (!phoneNumber) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!adminPhoneNumbers.includes(phoneNumber)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/login')) {
    if (phoneNumber) {
      return NextResponse.redirect(
        new URL(adminPhoneNumbers.includes(phoneNumber) ? '/admin' : '/', request.url)
      );
    }
  }

  return NextResponse.next();
}
