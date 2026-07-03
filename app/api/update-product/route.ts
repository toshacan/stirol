import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      id, 
      title, 
      price, 
      description, 
      description_ua, 
      category, 
      status, 
      images, 
      position,
      colorVariants,
      color_variants
    } = body;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // Избавляемся от parseFloat, сохраняем цену как строку со всеми знаками типа $
    const cleanPrice = price !== undefined && price !== null ? String(price).trim() : '';
    // Гарантируем, что позиция преобразуется в число, даже если пришла пустая строка
    const cleanPosition = position !== undefined && position !== null && position !== '' ? parseInt(position, 10) : 0;

    const { data, error } = await supabase
      .from('products')
      .update({ 
        title, 
        price: cleanPrice, 
        description, 
        description_ua: description_ua || null, 
        category, 
        status: status || null, 
        images: images || [],
        position: cleanPosition, 
        color_variants: colorVariants || color_variants || [] 
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}