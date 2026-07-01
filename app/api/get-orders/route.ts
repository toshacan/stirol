import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase'; // Импортируем функцию

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin(); // Вызываем ее здесь
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}