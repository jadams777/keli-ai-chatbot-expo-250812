import NextAuth from 'next-auth';
import { authConfig } from './app/(auth)/auth.config';

export async function middleware(request: any) {
  return NextAuth(authConfig).auth(request);
}

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
