import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Проверка наличия ключей, чтобы не падать сразу
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    // 2. Инициализация клиента
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. Запрос к базе
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_spent', { ascending: false });

    // 4. Если база вернула ошибку, отправляем JSON с ошибкой
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Успех
    return NextResponse.json(data || []);
    
  } catch (err) {
    // 6. Если упал сам код (не база), отправляем JSON
    console.error('Unexpected API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}