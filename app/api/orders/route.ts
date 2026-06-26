import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { GOOGLE_SHEET_WEBHOOK_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!GOOGLE_SHEET_WEBHOOK_URL || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, country, city, zip, address, cart, total } = body;

    // Формируем красивую строку со списком вещей для таблицы
    const itemsSummary = cart.map((i: any) => `${i.title} (${i.size})`).join(', ');

    // 1. ОТПРАВКА В GOOGLE ТАБЛИЦУ
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        name, email, phone, country, city, zip, address, total,
        items: itemsSummary
      }),
    });

    // 2. ФОРМИРОВАНИЕ СТИЛЬНОГО СООБЩЕНИЯ ДЛЯ TELEGRAM
    const tgMessage = 
`⚡️ [ STIROL — NEW ORDER ] ⚡️
───────────────────
👤 CLIENT: ${name.toUpperCase()}
📞 PHONE: ${phone}
✉️ EMAIL: ${email}

📍 SHIPPING:
${country.toUpperCase()}, ${city.toUpperCase()}
${address.toUpperCase()}, ${zip}

📦 ITEMS:
${cart.map((i: any) => `• ${i.title} [SIZE: ${i.size}] — ${i.price}`).join('\n')}

💰 TOTAL: ${total}€
───────────────────`;

    // 3. ОТПРАВКА В TELEGRAM
    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: tgMessage,
      }),
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("💥 Error processing order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}