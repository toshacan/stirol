import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase'; // Наш новый админ-клиент

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, country, city, zip, address, cart, total, lang } = body;

    const itemsSummary = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      return itemTitle + " (" + itemSize + ")";
    }).join(', ');

    // 1. ОТПРАВЛЯЕМ В SUPABASE
    const { data, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        name, email, phone, country, city, zip, address, 
        items: itemsSummary, 
        total: parseFloat(total), 
        lang, 
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error("Database insert failed: " + dbError.message);
    
    // Получаем реальный ID из базы
    const orderId = data[0].id;

    // 2. ЛОКАЛИЗАЦИЯ EMAIL (Логика сохранена)
    const isEn = lang === 'EN';
    const mailSubject = isEn ? "STIROL — ORDER RECEIVED #" + orderId : "STIROL — ЗАМОВЛЕННЯ ПРИЙНЯТО #" + orderId;
    const mailHeading = isEn ? 'STIROL — ORDER CONFIRMATION' : 'STIROL — ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ';
    const mailTextSuccess = isEn ? 'THANK YOU FOR YOUR ORDER. WE ARE PREPARING IT FOR SHIPPING.' : 'ДЯКУЄМО ЗА ВАШЕ ЗАМОВЛЕННЯ. МИ ВЖЕ ГОТУЄМО ЙОГО ДО ВІДПРАВКИ.';
    const mailTextId = isEn ? 'ORDER NUMBER:' : 'НОМЕР ЗАМОВЛЕННЯ:';
    const mailTextItems = isEn ? 'ITEMS:' : 'ТОВАРИ:';
    const mailTextSize = isEn ? 'SIZE' : 'РОЗМІР';
    const mailTextTotal = isEn ? 'TOTAL TO PAY:' : 'РАЗОМ ДО СПЛАТИ:';
    const mailTextFooter = isEn 
      ? 'OUR MANAGER WILL CONTACT YOU SHORTLY TO CONFIRM DELIVERY AND PAYMENT.' 
      : 'НАШ МЕНЕДЖЕР ЗВ’ЯЖЕТЬСЯ З ВАМИ НАЙБЛИЖЧИМ ЧАСОМ ДЛЯ ПІДТВЕРДЖЕННЯ ДОСТАВКИ ТА ОПЛАТИ.';

    const emailItemsHtml = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      const itemPrice = i.price || '0€';
      return "• " + itemTitle + " [" + mailTextSize + ": " + itemSize + "] — " + itemPrice;
    }).join('<br />');

    const htmlContent = `<div style="font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px; max-width: 600px;">
        <h2 style="border-bottom: 1px solid #000; padding-bottom: 10px;">${mailHeading}</h2>
        <p>${mailTextSuccess}</p>
        <p><strong>${mailTextId}</strong> #${orderId}</p>
        <br />
        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
          <strong>${mailTextItems}</strong><br />${emailItemsHtml}
        </div>
        <p><strong>${mailTextTotal}</strong> ${total}€</p>
        <br />
        <p style="color: #666; font-size: 11px;">${mailTextFooter}</p>
      </div>`;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: email,
      subject: mailSubject,
      html: htmlContent,
    });

    // 3. TELEGRAM УВЕДОМЛЕНИЕ
    const itemsTgList = (cart || []).map((i: any) => 
      `• ${i.title || i.name} [SIZE: ${i.size || 'OS'}] — ${i.price || '0€'}`
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