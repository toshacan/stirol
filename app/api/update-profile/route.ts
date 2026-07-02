import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Инициализируем клиента Supabase (берем доступы из .env файла Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Для админских действий идеально использовать SERVICE_ROLE_KEY, но если его нет, сработает и ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, updates } = body;

    // 1. Проверяем, что нам вообще передали данные
    if (!email || !updates) {
      return NextResponse.json(
        { success: false, error: 'Email and updates are required' },
        { status: 400 }
      );
    }

    // 2. Достаем и очищаем статус от "мусорных" кавычек (главная причина бага)
    let { client_status } = updates;
    if (client_status) {
      client_status = client_status.replace(/['"]/g, '').trim();
    }

    // 3. Отправляем запрос в Supabase на обновление строки в таблице profiles
    const { data, error } = await supabase
      .from('profiles') // Убедись, что твоя таблица называется именно 'profiles'
      .update({ client_status: client_status })
      .eq('email', email)
      .select(); // select() нужен, чтобы Supabase вернул обновленные данные

    // 4. Если Supabase ругается — ловим ошибку
    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 5. Все прошло успешно!
    return NextResponse.json({ success: true, updated: data });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}