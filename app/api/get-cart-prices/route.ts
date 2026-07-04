import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json(); // Получаем список ID товаров в корзине

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ prices: {} });
    }

    // Достаем актуальные цены из базы
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, price')
      .in('id', ids);

    if (error) throw error;

    // Превращаем в объект вида { 'id_товара': '45€' }
    const pricesMap = products.reduce((acc, p) => {
      acc[p.id] = p.price;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ prices: pricesMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}