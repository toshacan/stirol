import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cancelOrder } from '@/lib/orderCancellation';
import { sendOrderStatusEmail } from '@/lib/orderEmails';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: expiredOrders, error } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('status', 'AWAITING_PAYMENT')
      .lte('payment_due_at', new Date().toISOString());

    if (error) throw error;

    let cancelled = 0;
    for (const expiredOrder of expiredOrders || []) {
      const result = await cancelOrder(String(expiredOrder.id));
      if (result.cancelled && result.order) {
        await sendOrderStatusEmail(result.order);
        cancelled += 1;
      }
    }

    return NextResponse.json({ success: true, cancelled });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to expire orders.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
