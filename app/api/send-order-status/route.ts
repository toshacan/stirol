import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { order } = await request.json();
    
    // Если трек-номер не передан в объекте, ставим PENDING
    const trackNum = order.tracking || 'PENDING';
    const isShipped = order.status === 'SHIPPED';
    const lang = order.lang === 'UA' ? 'UA' : 'EN';

    const mail = {
      heading: lang === 'UA' 
        ? (isShipped ? 'ЗАМОВЛЕННЯ ВІДПРАВЛЕНО' : 'ЗАМОВЛЕННЯ СКАСОВАНО')
        : (isShipped ? 'ORDER SHIPPED' : 'ORDER CANCELLED'),
      body: lang === 'UA'
        ? (isShipped 
            ? `Ми відправили ваше замовлення #${order.id}. Трек-номер: <b>${trackNum}</b>.` 
            : `На жаль, замовлення #${order.id} було скасовано. Ми щиро перепрошуємо за незручності та повернемо кошти найближчим часом.`)
        : (isShipped 
            ? `Your order #${order.id} has been shipped. Tracking number: <b>${trackNum}</b>.` 
            : `Unfortunately, order #${order.id} has been cancelled. We sincerely apologize for the inconvenience and will process your refund shortly.`)
    };

    const htmlContent = `
      <div style="font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px; max-width: 600px; border: 1px solid #000;">
        <h2 style="border-bottom: 1px solid #000; padding-bottom: 10px; margin-top: 0;">STIROL // ${mail.heading}</h2>
        <p>${mail.body}</p>
        <br/>
        <div style="border-top: 1px solid #000; pt: 10px; font-size: 11px; color: #666;">
          <p>STIROL SYSTEM // CONTACT US FOR ANY QUESTIONS</p>
        </div>
      </div>`;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: order.email,
      subject: `STIROL // ${mail.heading} #${order.id}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}