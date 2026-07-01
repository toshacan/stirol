import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const secret = process.env.ADMIN_SECRET;

    // ДЕБАГ: Если в терминале увидишь undefined — значит .env не подгружен
    if (!secret) {
      console.error("❌ ADMIN_SECRET не найден в переменных окружения!");
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    if (password === secret) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 дней
        path: '/',
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}