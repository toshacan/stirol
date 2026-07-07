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
    // Идём по позициям заказа и резервируем сток одну за одной.
    // Если на каком-то шаге не хватило — откатываем всё, что успели списать, и не создаём заказ.
    const reserved: { id: string; size: string; quantity: number }[] = [];

    for (const item of verifiedCartItems) {
      const { data: success, error: rpcError } = await supabaseAdmin.rpc('decrement_variant_stock', {
        p_product_id: item.id,
        p_size: item.size,
        p_qty: item.quantity,
      });

      if (rpcError) {
        console.error("💥 Stock RPC error:", rpcError);
        // откатываем всё, что уже списали в этом запросе
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
        // не хватило стока — откатываем всё, что уже списали в этом запросе
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
      // заказ не создался, а сток уже списан — откатываем, чтобы не потерять товар зря
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

    // --- ОБНОВЛЕНИЕ СТАТУСА ТОВАРА (soldout / ACTIVE) НА ОСНОВЕ АКТУАЛЬНОГО СТОКА ---
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
    const htmlContent = `<div style="font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #000; padding: 20px;">
        <h2>${isEn ? 'STIROL — ORDER CONFIRMATION' : 'STIROL — ПІДТВЕРДЖЕННЯ ЗАМОВЛЕННЯ'}</h2>
        <p>#${orderId}</p>
        <p>${isEn ? 'TOTAL:' : 'РАЗОМ:'} ${verifiedTotal}€</p>
      </div>`;

    await resend.emails.send({
      from: 'STIROL <orders@stirol.xyz>',
      to: email,
      subject: `STIROL — #${orderId}`,
      html: htmlContent,
    });

    const tgMessage = `STIROL — NEW ORDER #${orderId}\nCLIENT: ${name}\nEMAIL: ${email}\nTOTAL: ${verifiedTotal}€`;

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