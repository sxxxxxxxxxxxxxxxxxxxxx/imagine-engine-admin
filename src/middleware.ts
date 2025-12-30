/**
 * Next.js中间件 - 保护管理后台路由
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 登录页面和API路由不需要验证
  if (pathname === '/login' || 
      pathname === '/' || 
      pathname === '/bypass' ||
      pathname === '/login/page-bypass' ||
      pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 检查session cookie
  const session = request.cookies.get('admin-session');

  if (!session) {
    // 未登录，重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
