import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Список ПУБЛИЧНЫХ API, куда можно ходить обычным пользователям с сайта
const PUBLIC_API_ROUTES = [
  '/api/get-products',
  '/api/get-categories',
  '/api/get-cart-prices',
  '/api/orders',
  '/api/subscribe',
  '/api/send-email',
  '/api/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessCookie = request.cookies.get('admin-auth');
  const secret = process.env.ADMIN_SECRET;

  // 1. ЗАЩИТА СТРАНИЦЫ АДМИНКИ (/super-panel)
  if (pathname.startsWith('/super-panel')) {
    if (!accessCookie || accessCookie.value !== secret) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. ЗАЩИТА АДМИНСКИХ API-РОУТОВ
  if (pathname.startsWith('/api/')) {
    // Если это НЕ публичный роут, требуем пароль в куках
    if (!PUBLIC_API_ROUTES.includes(pathname)) {
      if (!accessCookie || accessCookie.value !== secret) {
        return NextResponse.json(
          { error: 'Unauthorized: Access Denied' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}