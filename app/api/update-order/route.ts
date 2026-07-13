import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing order ID or updates' }, { status: 400 });
    }

    // Смотрим, что было с заказом ДО обновления — нужно, чтобы понять,
    // происходит ли переход "в CANCELLED" именно сейчас (а не повторное сохранение
    // уже отменённого заказа — иначе сток вернулся бы дважды)
    const { data: existingOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('status, items_json')
      .eq('id', id)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isNewlyCancelled = updates.status === 'CANCELLED' && existingOrder.status !== 'CANCELLED';

    // 1. Обновляем сам заказ
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // 2. Если заказ только что отменили — возвращаем сток по каждой позиции
    if (isNewlyCancelled && Array.isArray(existingOrder.items_json)) {
      for (const item of existingOrder.items_json) {
        await supabaseAdmin.rpc('increment_variant_stock', {
          p_product_id: item.id,
          p_size: item.size,
          p_qty: item.quantity,
        });
      }

      // Пересчитываем статус товаров (soldout -> ACTIVE), если сток снова появился
      const uniqueProductIds = [...new Set(existingOrder.items_json.map((i: any) => i.id))];
      for (const productId of uniqueProductIds) {
        const { data: variants } = await supabaseAdmin
          .from('product_variants')
          .select('stock')
          .eq('product_id', productId);

        const totalStock = (variants || []).reduce((acc, v: any) => acc + (parseInt(v.stock, 10) || 0), 0);

        if (totalStock > 0) {
          await supabaseAdmin
            .from('products')
            .update({ status: 'ACTIVE' })
            .eq('id', productId)
            .eq('status', 'soldout'); // трогаем только если реально был soldout
        }
      }
    }

    return NextResponse.json({ success: true, stockRestored: isNewlyCancelled });
  } catch (err: any) {
    console.error("Update Order Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}