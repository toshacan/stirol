import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Проверяем, заходит ли пользователь на нашу секретную страницу
  if (request.nextUrl.pathname.startsWith('/my-super-secret-panel')) {
    
    // Проверяем, есть ли у него "пропуск" (куки)
    const accessCookie = request.cookies.get('admin-auth');
    const secret = process.env.ADMIN_SECRET;

    // Если пропуска нет или он неверный — выкидываем на главную
    if (!accessCookie || accessCookie.value !== secret) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}