import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cancelOrder } from '@/lib/orderCancellation';
import { sendOrderStatusEmail } from '@/lib/orderEmails';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing order ID or updates' }, { status: 400 });
    }

    if (updates.status === 'CANCELLED') {
      const { cancelled, order } = await cancelOrder(id, updates);
      if (cancelled && order) {
        await sendOrderStatusEmail(order);
      }
      return NextResponse.json({ success: true, stockRestored: cancelled });
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, stockRestored: false });
  } catch (err: any) {
    console.error("Update Order Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
