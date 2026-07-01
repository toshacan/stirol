import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Импортируем готовый объект

export async function POST(request: Request) {
  try {
    const { id, updates } = await request.json();
    
    // Проверка на наличие обязательных данных
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }
  
    const { error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}