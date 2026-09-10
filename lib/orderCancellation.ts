import { supabaseAdmin } from '@/lib/supabase';

type CancelUpdates = Record<string, unknown>;
const STOCK_RESTORABLE_STATUSES = ['AWAITING_PAYMENT', 'PAID', 'PACKING'];

export async function cancelOrder(id: string, updates: CancelUpdates = {}) {
  // Read the current status first so a shipped order can still be marked
  // cancelled without accidentally returning an item that has already left.
  const { data: currentOrder, error: currentOrderError } = await supabaseAdmin
    .from('orders')
    .select('id, status')
    .eq('id', id)
    .maybeSingle();

  if (currentOrderError) throw currentOrderError;
  if (!currentOrder || currentOrder.status === 'CANCELLED') {
    return { cancelled: false, stockRestored: false, order: null };
  }

  const shouldRestoreStock = STOCK_RESTORABLE_STATUSES.includes(currentOrder.status);

  // The status condition makes this safe if another request changes the order
  // between the read above and this update.
  const cancellationQuery = shouldRestoreStock
    ? supabaseAdmin
        .from('orders')
        .update({ ...updates, status: 'CANCELLED' })
        .eq('id', id)
        .in('status', STOCK_RESTORABLE_STATUSES)
    : supabaseAdmin
        .from('orders')
        .update({ ...updates, status: 'CANCELLED' })
        .eq('id', id)
        .eq('status', currentOrder.status);

  const { data: cancelledOrders, error: updateError } = await cancellationQuery
    .select('id, status, items_json, email, lang, tracking');

  if (updateError) throw updateError;
  const order = cancelledOrders?.[0];
  if (!order) return { cancelled: false, stockRestored: false, order: null };

  if (shouldRestoreStock && Array.isArray(order.items_json)) {
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

  return { cancelled: true, stockRestored: shouldRestoreStock, order };
}
