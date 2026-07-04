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
    const { name, email, phone, country, city, zip, address, cart, lang } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const productIds = cart.map((item: any) => item.id).filter(Boolean);
    
    const { data: realProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, title, price, variants')
      .in('id', productIds);

    if (prodError || !realProducts) {
      throw new Error('Failed to verify products price from database');
    }

    let verifiedTotal = 0;
    let totalQuantity = 0;
    const verifiedCartItems: any[] = [];

    for (const cartItem of cart) {
      const realProd = realProducts.find((p) => p.id === cartItem.id);
      if (!realProd) continue; 

      const qty = Math.max(1, parseInt(cartItem.quantity) || 1);
      const cleanPriceStr = typeof realProd.price === 'string' ? realProd.price : String(realProd.price || '0');
      const unitPrice = parseFloat(cleanPriceStr.replace(/[^0-9.]/g, '')) || 0;

      verifiedTotal += unitPrice * qty;
      totalQuantity += qty;

      verifiedCartItems.push({
        id: realProd.id,
        title: realProd.title,
        size: cartItem.size || 'OS',
        quantity: qty,
        unitPrice: unitPrice,
        priceStr: `${unitPrice}€`
      });
    }

    const itemsSummary = verifiedCartItems
      .map((i) => `${i.title} (${i.size}) x${i.quantity}`)
      .join(', ');

    const { data, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        name, email, phone, country, city, zip, address, 
        items: itemsSummary, 
        total: verifiedTotal, 
        quantity: totalQuantity,
        lang, 
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error("Database insert failed: " + dbError.message);
    const orderId = data[0].id;

    // --- БРОНЕБОЙНОЕ СПИСАНИЕ СТОКА (ПО ЛОГИКЕ АДМИНКИ + БД) ---
    for (const item of verifiedCartItems) {
      const targetSize = String(item.size || 'OS').toUpperCase().trim();
      let updatedSuccessfully = false;

      // СПОСОБ 1: Ищем в отдельной таблице product_variants
      const { data: pvList } = await supabaseAdmin
        .from('product_variants')
        .select('id, size, stock')
        .eq('product_id', item.id);

      if (pvList && pvList.length > 0) {
        let variant = pvList.find(v => String(v.size || '').toUpperCase().trim() === targetSize);
        if (!variant && pvList.length === 1) variant = pvList[0]; // Если размер всего один (OS)

        if (variant) {
          const newStock = Math.max(0, (variant.stock || 0) - item.quantity);
          await supabaseAdmin
            .from('product_variants')
            .update({ stock: newStock })
            .eq('id', variant.id);
          variant.stock = newStock;
          updatedSuccessfully = true;

          // Проверка на Sold Out
          const totalStock = pvList.reduce((acc, v) => acc + (v.stock || 0), 0);
          if (totalStock <= 0) {
            await supabaseAdmin.from('products').update({ status: 'soldout' }).eq('id', item.id);
          }
        }
      }

      // СПОСОБ 2 (ПО ЛОГИКЕ ТВОЕЙ АДМИНКИ): Если в таблице product_variants ничего нет,
      // обновляем массив variants прямо внутри таблицы products!
      if (!updatedSuccessfully) {
        const prod = realProducts.find(p => p.id === item.id);
        if (prod && Array.isArray(prod.variants)) {
          const updatedVariants = prod.variants.map((v: any) => {
            const vSize = String(v.size || '').toUpperCase().trim();
            if (vSize === targetSize || prod.variants.length === 1) {
              const currentStock = parseInt(v.stock) || 0;
              return { ...v, stock: Math.max(0, currentStock - item.quantity) };
            }
            return v;
          });

          await supabaseAdmin
            .from('products')
            .update({ variants: updatedVariants })
            .eq('id', item.id);

          // Проверка на Sold Out для JSON массива
          const totalStock = updatedVariants.reduce((acc: number, v: any) => acc + (parseInt(v.stock) || 0), 0);
          if (totalStock <= 0) {
            await supabaseAdmin.from('products').update({ status: 'soldout' }).eq('id', item.id);
          }
        }
      }
    }

    const isEn = lang === 'EN';
    const mailHeading = isEn ? 'STIROL — ORDER CONFIRMATION' : 'STIROL — ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ';
    
    const emailItemsHtml = verifiedCartItems.map((i) => {
      return `• ${i.title} [SIZE: ${i.size}] x${i.quantity} — ${i.priceStr}`;
    }).join('<br />');

    const htmlContent = `<div style="font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px; max-width: 600px;">
        <h2 style="border-bottom: 1px solid #000; padding-bottom: 10px;">${mailHeading}</h2>
        <p><strong>${isEn ? 'ORDER NUMBER:' : 'НОМЕР ЗАМОВЛЕННЯ:'}</strong> #${orderId}</p>
        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
          <strong>${isEn ? 'ITEMS:' : 'ТОВАРИ:'}</strong><br />${emailItemsHtml}
        </div>
        <p><strong>${isEn ? 'TOTAL TO PAY:' : 'РАЗОМ ДО СПЛАТИ:'}</strong> ${verifiedTotal}€</p>
      </div>`;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: email,
      subject: isEn ? "STIROL — ORDER RECEIVED #" + orderId : "STIROL — ЗАМОВЛЕННЯ ПРИЙНЯТО #" + orderId,
      html: htmlContent,
    });

    const itemsTgList = verifiedCartItems.map((i) => 
      `• ${i.title} [SIZE: ${i.size}] x${i.quantity} — ${i.priceStr}`
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
      `TOTAL: ${verifiedTotal}€`,
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