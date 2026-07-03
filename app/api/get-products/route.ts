import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Эти две строки — ключ к тому, чтобы данные обновлялись мгновенно (без задержек кэша)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Делаем джойн: вытягиваем товар вместе с его размерами.
    // Сортируем по 'position', как мы и договаривались ранее.
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('position', { ascending: true }); // Теперь сортировка будет работать стабильно

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Unexpected Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}