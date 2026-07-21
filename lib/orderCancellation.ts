import { supabaseAdmin } from '@/lib/supabase';

type CancelUpdates = Record<string, unknown>;

export async function cancelOrder(id: string, updates: CancelUpdates = {}) {
  // The conditional update is the lock: only one request can transition an order
  // to CANCELLED and therefore return its stock or send the automatic email.
  const { data: cancelledOrders, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ ...updates, status: 'CANCELLED' })
    .eq('id', id)
    .neq('status', 'CANCELLED')
    .select('id, status, items_json, email, lang, tracking');

  if (updateError) throw updateError;
  const order = cancelledOrders?.[0];
  if (!order) return { cancelled: false, order: null };

  if (Array.isArray(order.items_json)) {
    for (const item of order.items_json) {
      await supabaseAdmin.rpc('increment_variant_stock', {
        p_product_id: item.id,
        p_size: item.size,
        p_qty: item.quantity,
      });
    }

    const productIds = [...new Set(order.items_json.map((item: { id: string }) => item.id))];
    for (const productId of productIds) {
      const { data: variants } = await supabaseAdmin
        .from('product_variants')
        .select('stock')
        .eq('product_id', productId);
      const totalStock = (variants || []).reduce(
        (sum, variant: { stock: number | string | null }) => sum + (Number(variant.stock) || 0),
        0,
      );

      if (totalStock > 0) {
        await supabaseAdmin
          .from('products')
          .update({ status: 'ACTIVE' })
          .eq('id', productId)
          .eq('status', 'soldout');
      }
    }
  }

  return { cancelled: true, order };
}
