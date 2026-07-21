import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml, isRateLimited } from '@/lib/formProtection';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, 'contact', { limit: 3, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { name, email, order, theme, message, website } = await request.json();

    // Bots often complete every input they find. Real visitors never see this field.
    if (website) return NextResponse.json({ success: true });

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOrder = escapeHtml(order || 'NONE');
    const safeTheme = escapeHtml(theme || 'NOT SELECTED');
    const safeMessage = escapeHtml(message);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'atnonsh@gmail.com', // Сюда твою почту!
      subject: `STIROL CONTACT // ${String(theme || 'GENERAL').slice(0, 80)} from ${String(name).slice(0, 80)}`,
      html: `
        <div style="font-family: monospace; padding: 24px; border: 1px solid #000; max-width: 600px; margin: 0 auto; color: #000;">
          <h2 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 12px; margin-top: 0; font-size: 14px; font-weight: bold; tracking: 0.1em;">NEW MESSAGE // STIROL SYSTEM</h2>
          <p style="margin: 14px 0; font-size: 12px;"><strong>NAME:</strong> ${safeName}</p>
          <p style="margin: 14px 0; font-size: 12px;"><strong>EMAIL:</strong> ${safeEmail}</p>
          <p style="margin: 14px 0; font-size: 12px;"><strong>THEME:</strong> ${safeTheme}</p>
          <p style="margin: 14px 0; font-size: 12px;"><strong>ORDER #:</strong> ${safeOrder}</p>
          <p style="margin: 20px 0 6px 0; font-size: 12px;"><strong>MESSAGE:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-left: 4px solid #000; white-space: pre-wrap; font-size: 12px; line-height: 1.6;">${safeMessage}</div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
