import { NextResponse } from 'next/server';
import { sendOrderMessageEmail } from '@/lib/orderEmails';

export async function POST(request: Request) {
  try {
    const { email, orderId, subject, message } = await request.json();
    if (!email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Email, subject, and message are required.' }, { status: 400 });
    }

    await sendOrderMessageEmail(
      { id: orderId?.trim() || 'MESSAGE', email: email.trim() },
      subject,
      message,
    );
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to send message.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
