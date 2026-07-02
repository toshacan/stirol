import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, country, city, zip, address, cart, total, lang } = body;

    const totalQuantity = (cart || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

    const itemsSummary = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      const itemQty = i.quantity || 1;
      return `${itemTitle} (${itemSize}) x${itemQty}`;
    }).join(', ');

    const { data, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        name, email, phone, country, city, zip, address, 
        items: itemsSummary, 
        total: parseFloat(total), 
        quantity: totalQuantity,
        lang, 
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error("Database insert failed: " + dbError.message);
    
    const orderId = data[0].id;

    const isEn = lang === 'EN';
    const mailHeading = isEn ? 'STIROL — ORDER CONFIRMATION' : 'STIROL — ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ';
    const mailTextId = isEn ? 'ORDER NUMBER:' : 'НОМЕР ЗАМОВЛЕННЯ:';
    const mailTextItems = isEn ? 'ITEMS:' : 'ТОВАРИ:';
    const mailTextTotal = isEn ? 'TOTAL TO PAY:' : 'РАЗОМ ДО СПЛАТИ:';

    const emailItemsHtml = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      const itemQty = i.quantity || 1;
      const itemPrice = i.price || '0€';
      return `• ${itemTitle} [SIZE: ${itemSize}] x${itemQty} — ${itemPrice}`;
    }).join('<br />');

    const htmlContent = `<div style="font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px; max-width: 600px;">
        <h2 style="border-bottom: 1px solid #000; padding-bottom: 10px;">${mailHeading}</h2>
        <p><strong>${mailTextId}</strong> #${orderId}</p>
        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
          <strong>${mailTextItems}</strong><br />${emailItemsHtml}
        </div>
        <p><strong>${mailTextTotal}</strong> ${total}€</p>
      </div>`;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: email,
      subject: isEn ? "STIROL — ORDER RECEIVED #" + orderId : "STIROL — ЗАМОВЛЕННЯ ПРИЙНЯТО #" + orderId,
      html: htmlContent,
    });

    const itemsTgList = (cart || []).map((i: any) => 
      `• ${i.title || i.name} [SIZE: ${i.size || 'OS'}] x${i.quantity || 1} — ${i.price || '0€'}`
    ).join('\n');
    
    const tgMessage = [
      ` STIROL — NEW ORDER #${orderId} `,
      "----------------------------------",
      `CLIENT: ${name?.toUpperCase()}`,
      `PHONE: ${phone}`,
      `EMAIL: ${email}`,
      `LANG: ${lang}`,
      "",
      "SHIPPING:",
      `${country?.toUpperCase()}, ${city?.toUpperCase()}`,
      `${address?.toUpperCase()}, ${zip}`,
      "",
      "ITEMS:",
      itemsTgList,
      "",
      `TOTAL QTY: ${totalQuantity}`,
      `TOTAL: ${total}€`,
      "----------------------------------"
    ].join('\n');

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: tgMessage }),
    });

    return NextResponse.json({ success: true, orderId });

  } catch (error: any) {
    console.error("💥 Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}