import { NextResponse } from 'next/server';
import { sendOrderStatusEmail } from '@/lib/orderEmails';

export async function POST(request: Request) {
  try {
    const { order } = await request.json();
    await sendOrderStatusEmail(order);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
