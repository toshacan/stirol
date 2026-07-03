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
      variants,       
      colorVariants,  
      color_variants, 
      position        
    } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing required fields: ID and Title' }, { status: 400 });
    }

    // Избавляемся от parseFloat, сохраняем цену как строку со всеми знаками типа $
    const cleanPrice = price !== undefined && price !== null ? String(price).trim() : '';
    // Гарантируем, что позиция преобразуется в число, даже если пришла пустая строка
    const cleanPosition = position !== undefined && position !== null && position !== '' ? parseInt(position, 10) : 0;

    // Шаг 1: Создаем продукт
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([
        { 
          id, 
          title, 
          price: cleanPrice, 
          description, 
          description_ua: description_ua || null, 
          category, 
          status: status || null, 
          images: images || [],
          position: cleanPosition,
          color_variants: colorVariants || color_variants || []
        }
      ])
      .select();

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 400 });
    }

    // Шаг 2: Сохраняем размеры в 'product_variants'
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantsToInsert = variants.map((v: any) => ({
        product_id: id,
        size: v.size,
        stock: parseInt(v.stock) || 0,
      }));

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variantsToInsert);

      if (variantsError) {
        console.error('Ошибка сохранения размеров:', variantsError.message);
      }
    }

    return NextResponse.json({ success: true, data: productData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}