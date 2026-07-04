import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, price, description, description_ua, image_url, category, variants } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    // 1. Обновляем основные поля
    const updateData: any = { 
      title, 
      price, 
      description, 
      description_ua, 
      image_url, 
      category 
    };
    
    await supabaseAdmin.from('products').update(updateData).eq('id', id);

    // 2. Обновляем варианты
    if (variants && Array.isArray(variants)) {
      // Чистим старые
      await supabaseAdmin.from('product_variants').delete().eq('product_id', id);
      
      // Вставляем новые
      const cleanVariants = variants
        .filter((v: any) => v.size && v.size.trim() !== '')
        .map((v: any) => ({
          product_id: id,
          size: v.size.toUpperCase().trim(),
          stock: Math.max(0, parseInt(v.stock, 10) || 0)
        }));
      
      if (cleanVariants.length > 0) {
        await supabaseAdmin.from('product_variants').insert(cleanVariants);
      }

      // 3. Авто-пересчет статуса на "soldout" или "ACTIVE"
      const totalStock = cleanVariants.reduce((acc, v) => acc + (v.stock || 0), 0);
      
      if (totalStock === 0) {
        await supabaseAdmin
          .from('products')
          .update({ status: 'soldout' })
          .eq('id', id);
      } else {
        await supabaseAdmin
          .from('products')
          .update({ status: 'ACTIVE' })
          .eq('id', id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update Product Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}