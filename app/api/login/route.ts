import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_SECRET) {
    const response = NextResponse.json({ success: true });
    // Ставим куку на 30 дней
    response.cookies.set('admin-auth', password, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, 
    });
    return response;
  }
  
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}