import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!process.env.GOOGLE_SHEET_WEBHOOK_URL) {
    console.error("❌ ОШИБКА: Нет ссылки на Google Таблицу в .env.local!");
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Отправляем email в Google Таблицу по нашей ссылке
    const googleResponse = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await googleResponse.json();

    if (result.result !== 'success') {
      console.error("❌ Ошибка записи в Google Скрипт:", result.error);
      return NextResponse.json({ error: 'Failed to save to sheet' }, { status: 400 });
    }

    console.log("✅ Email успешно записан в Google Таблицу!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("💥 КРИТИЧЕСКАЯ ОШИБКА БЭКЕНДА ТАБЛИЦЫ:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}