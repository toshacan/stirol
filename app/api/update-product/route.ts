import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, title_ua, price, description, description_ua, image_url, images, category, variants } = body;

    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    // 1. Обновление метаданных
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (title_ua !== undefined) updateData.title_ua = title_ua;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (description_ua !== undefined) updateData.description_ua = description_ua;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;

    if (Object.keys(updateData).length > 0) {
      await supabaseAdmin.from('products').update(updateData).eq('id', id);
    }

    // 2. Обновление вариантов и авто-статус
    if (variants && Array.isArray(variants)) {
      await supabaseAdmin.from('product_variants').delete().eq('product_id', id);
      
      const cleanVariants = variants
        .filter((v: any) => v.size && v.size.trim() !== '')
        .map((v: any) => ({
          product_id: id,
          size: v.size.trim().toUpperCase(),
          stock: Math.max(0, parseInt(v.stock, 10) || 0)
        }));

      if (cleanVariants.length > 0) {
        await supabaseAdmin.from('product_variants').insert(cleanVariants);
      }

      // Пересчет общего стока для установки статуса
      const totalStock = cleanVariants.reduce((sum, v) => sum + v.stock, 0);
      const newStatus = totalStock <= 0 ? 'soldout' : 'ACTIVE';
      
      await supabaseAdmin
        .from('products')
        .update({ status: newStatus })
        .eq('id', id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('UPDATE ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}