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
    let { name, email, phone, country, city, zip, address, cart, lang } = body;

    email = (email || '').toLowerCase().trim();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const productIds = cart.map((item: any) => item.id).filter(Boolean);

    const { data: realProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, title, price')
      .in('id', productIds);

    if (prodError || !realProducts) {
      console.error("💥 DB Products Error:", prodError);
      throw new Error('Failed to verify products: ' + (prodError?.message || 'Unknown DB error'));
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
        size: String(cartItem.size || 'OS').toUpperCase().trim(),
        quantity: qty,
        unitPrice: unitPrice,
        priceStr: `${unitPrice}€`
      });
    }

    if (verifiedCartItems.length === 0) {
      return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 });
    }

    // --- АТОМАРНОЕ СПИСАНИЕ СТОКА (ДО создания заказа) ---
    const reserved: { id: string; size: string; quantity: number }[] = [];

    for (const item of verifiedCartItems) {
      const { data: success, error: rpcError } = await supabaseAdmin.rpc('decrement_variant_stock', {
        p_product_id: item.id,
        p_size: item.size,
        p_qty: item.quantity,
      });

      if (rpcError) {
        console.error("💥 Stock RPC error:", rpcError);
        for (const r of reserved) {
          await supabaseAdmin.rpc('increment_variant_stock', {
            p_product_id: r.id,
            p_size: r.size,
            p_qty: r.quantity,
          });
        }
        throw new Error('Stock check failed: ' + rpcError.message);
      }

      if (!success) {
        for (const r of reserved) {
          await supabaseAdmin.rpc('increment_variant_stock', {
            p_product_id: r.id,
            p_size: r.size,
            p_qty: r.quantity,
          });
        }
        return NextResponse.json(
          { error: `Sorry, "${item.title}" (${item.size}) just sold out. Please refresh and try again.` },
          { status: 409 }
        );
      }

      reserved.push({ id: item.id, size: item.size, quantity: item.quantity });
    }

    // --- ОБНОВЛЕНИЕ PROFILES ---
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        email: email,
        client_status: 'NEW',
        total_orders: 1,
        total_spent: Number(verifiedTotal.toFixed(2))
      }])
      .select('id');

    if (insertError) {
      if (insertError.code === '23505') {
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id, total_orders, total_spent')
          .eq('email', email)
          .single();

        if (existingProfile) {
          await supabaseAdmin
            .from('profiles')
            .update({
              total_orders: (existingProfile.total_orders || 0) + 1,
              total_spent: Number(((existingProfile.total_spent || 0) + verifiedTotal).toFixed(2))
            })
            .eq('id', existingProfile.id);
        }
      } else {
        console.error("💥 Profile insert error (non-blocking):", insertError.message);
      }
    }

    // --- СОЗДАНИЕ ЗАКАЗА ---
    const itemsSummary = verifiedCartItems.map((i) => `${i.title} (${i.size}) x${i.quantity}`).join(', ');

    const { data: orderData, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        name, email, phone, country, city, zip, address,
        items: itemsSummary,
        total: verifiedTotal,
        quantity: totalQuantity,
        lang,
        status: 'NEW'
      }])
      .select();

    if (dbError) {
      for (const r of reserved) {
        await supabaseAdmin.rpc('increment_variant_stock', {
          p_product_id: r.id,
          p_size: r.size,
          p_qty: r.quantity,
        });
      }
      throw new Error("Database insert failed: " + dbError.message);
    }
    const orderId = orderData[0].id;

    // --- ОБНОВЛЕНИЕ СТАТУСА ТОВАРА ---
    const uniqueProductIds = [...new Set(verifiedCartItems.map((i) => i.id))];
    for (const productId of uniqueProductIds) {
      const { data: currentVariants } = await supabaseAdmin
        .from('product_variants')
        .select('stock')
        .eq('product_id', productId);

      const totalStock = (currentVariants || []).reduce((acc, v: any) => acc + (parseInt(v.stock, 10) || 0), 0);

      await supabaseAdmin
        .from('products')
        .update({ status: totalStock <= 0 ? 'soldout' : 'ACTIVE' })
        .eq('id', productId);
    }

    // --- EMAIL И TELEGRAM ---
    const isEn = lang === 'EN';
    
    // Генерация строк товаров для таблицы в письме
    const itemsHtml = verifiedCartItems.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dashed #ccc;">
          <div style="font-weight: bold; margin-bottom: 4px;">${item.title}</div>
          <div style="color: #666; font-size: 12px;">SIZE: ${item.size}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px dashed #ccc; text-align: center;">x${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px dashed #ccc; text-align: right;">${item.unitPrice * item.quantity}€</td>
      </tr>
    `).join('');

    // Обновленный индустриальный дизайн письма (чек/инвойс)
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Courier New', Courier, monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #000; padding: 40px 20px; background-color: #fff; border: 2px solid #000;">
        
        <!-- HEADER -->
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 0.2em;">STIROL</h1>
          <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: bold;">
            ${isEn ? 'ORDER CONFIRMATION' : 'ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ'}
          </p>
        </div>

        <!-- INFO BLOCK -->
        <div style="margin-bottom: 40px; font-size: 14px; line-height: 1.6;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 5px; width: 35%; color: #666;">${isEn ? 'ORDER NO.' : 'ЗАМОВЛЕННЯ №'}</td>
              <td style="padding-bottom: 5px; font-weight: bold;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding-bottom: 5px; color: #666;">${isEn ? 'CLIENT' : 'КЛІЄНТ'}</td>
              <td style="padding-bottom: 5px;">${name}</td>
            </tr>
            <tr>
              <td style="padding-bottom: 5px; color: #666;">${isEn ? 'DESTINATION' : 'ДОСТАВКА'}</td>
              <td style="padding-bottom: 5px;">${address}, ${city}, ${zip}, ${country}</td>
            </tr>
            <tr>
              <td style="padding-bottom: 5px; color: #666;">${isEn ? 'CONTACT' : 'ЗВ\'ЯЗОК'}</td>
              <td style="padding-bottom: 5px;">${phone}</td>
            </tr>
          </table>
        </div>

        <!-- ITEMS TABLE -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 2px solid #000; padding-bottom: 8px;">${isEn ? 'ITEM' : 'ТОВАР'}</th>
              <th style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px;">${isEn ? 'QTY' : 'КІЛ-ТЬ'}</th>
              <th style="text-align: right; border-bottom: 2px solid #000; padding-bottom: 8px;">${isEn ? 'PRICE' : 'ЦІНА'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- TOTAL -->
        <div style="text-align: right; font-size: 20px; font-weight: 900; border-top: 2px solid #000; padding-top: 20px; margin-bottom: 40px;">
          ${isEn ? 'TOTAL' : 'РАЗОМ'}: ${verifiedTotal}€
        </div>

        <!-- FOOTER -->
        <div style="text-align: center; font-size: 10px; color: #666; border-top: 1px solid #000; padding-top: 20px;">
  
          <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} STIROL</p>
        </div>

      </div>
    `;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: email,
      subject: `STIROL — #${orderId}`,
      html: htmlContent,
    });

    // --- ФОРМИРОВАНИЕ НОВОГО СООБЩЕНИЯ В ТЕЛЕГРАМ ---
    const tgItemsList = verifiedCartItems
      .map(item => `• "${item.title}" [SIZE: ${item.size}] x${item.quantity} — ${item.unitPrice * item.quantity}€`)
      .join('\n');

    const tgMessage = `STIROL — NEW ORDER #${orderId} 
----------------------------------
CLIENT: ${name}
PHONE: ${phone}
EMAIL: ${email}
LANG: ${lang}

SHIPPING:
${country}, ${city}
${address}, ${zip}

ITEMS:
${tgItemsList}

TOTAL QTY: ${totalQuantity}
TOTAL: ${verifiedTotal}€`;

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