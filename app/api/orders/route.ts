import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { GOOGLE_SHEET_WEBHOOK_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!GOOGLE_SHEET_WEBHOOK_URL || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, country, city, zip, address, cart, total, lang } = body;

    // Безопасный сбор названий товаров (проверяем и title, и name)
    const itemsSummary = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      return itemTitle + " (" + itemSize + ")";
    }).join(', ');

    // 1. ОТПРАВЛЯЕМ В ТАБЛИЦУ И ПОЛУЧАЕМ ORDER ID
    let orderId = Math.floor(1000 + Math.random() * 9000);
    try {
      const sheetResponse = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          name, email, phone, country, city, zip, address, total,
          items: itemsSummary
        }),
      });
      const sheetData = await sheetResponse.json();
      if (sheetData.orderId) orderId = sheetData.orderId;
    } catch (sheetErr) {
      console.error("⚠️ Google Sheets error:", sheetErr);
    }

    // ЛОКАЛИЗАЦИЯ ДЛЯ EMAIL ЧЕКА (EN / UA)
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

    // Безопасная генерация HTML для товаров
    const emailItemsHtml = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      const itemPrice = i.price || '0€';
      return "• " + itemTitle + " [" + mailTextSize + ": " + itemSize + "] — " + itemPrice;
    }).join('<br />');

    const htmlContent = 
      "<div style=\"font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px; max-width: 600px;\">" +
        "<h2 style=\"border-bottom: 1px solid #000; padding-bottom: 10px;\">" + mailHeading + "</h2>" +
        "<p>" + mailTextSuccess + "</p>" +
        "<p><strong>" + mailTextId + "</strong> #" + orderId + "</p>" +
        "<br />" +
        "<div style=\"border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;\">" +
          "<strong>" + mailTextItems + "</strong><br />" +
          emailItemsHtml +
        "</div>" +
        "<p><strong>" + mailTextTotal + "</strong> " + total + "€</p>" +
        "<br />" +
        "<p style=\"color: #666; font-size: 11px;\">" + mailTextFooter + "</p>" +
      "</div>";

    // 2. ОТПРАВКА ПИСЬМА ЧЕРЕЗ RESEND
    try {
      const emailResult = await resend.emails.send({
        from: 'STIROL <orders@stirol.xyz>',
        to: email,
        subject: mailSubject,
        html: htmlContent,
      });
      console.log("📬 Resend API Response:", JSON.stringify(emailResult));
    } catch (emailErr) {
      console.error("❌ Resend execution failed:", emailErr);
    }

    // 3. ФОРМИРУЕМ ТЕКСТ ДЛЯ TELEGRAM
    const itemsTgList = (cart || []).map((i: any) => {
      const itemTitle = i.title || i.name || 'Item';
      const itemSize = i.size || 'OS';
      const itemPrice = i.price || '0€';
      return "• " + itemTitle + " [SIZE: " + itemSize + "] — " + itemPrice;
    }).join('\n');
    
    const tgLines = [
      " STIROL — NEW ORDER #" + orderId + " ",
      "----------------------------------",
      "CLIENT: " + (name ? name.toUpperCase() : 'UNKNOWN'),
      "PHONE: " + phone,
      "EMAIL: " + email,
      "LANG: " + lang,
      "",
      "SHIPPING:",
      (country ? country.toUpperCase() : '') + ", " + (city ? city.toUpperCase() : ''),
      (address ? address.toUpperCase() : '') + ", " + zip,
      "",
      "ITEMS:",
      itemsTgList,
      "",
      "TOTAL: " + total + "€",
      "----------------------------------"
    ];
    
    const tgMessage = tgLines.join('\n');

    // 4. ОТПРАВКА В TELEGRAM
    const tgUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: tgMessage,
      }),
    });

    return NextResponse.json({ success: true, orderId });

  } catch (error: any) {
    console.error("💥 Error processing order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}