import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });

    const { data: order, error: findError } = await supabaseAdmin
      .from('orders')
      .select('payment_due_at, status')
      .eq('id', id)
      .single();

    if (findError || !order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (order.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({ error: 'Only orders awaiting payment can be extended.' }, { status: 400 });
    }

    const currentDueAt = order.payment_due_at ? new Date(order.payment_due_at).getTime() : Date.now();
    const paymentDueAt = new Date(Math.max(currentDueAt, Date.now()) + PAYMENT_WINDOW_MS).toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payment_due_at: paymentDueAt })
      .eq('id', id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ success: true, paymentDueAt });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to extend payment deadline.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
