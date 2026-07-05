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

    // --- ФИЧА: НОРМАЛИЗАЦИЯ EMAIL ---
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
        size: cartItem.size || 'OS',
        quantity: qty,
        unitPrice: unitPrice,
        priceStr: `${unitPrice}€`
      });
    }

    // --- ФИЧА: РОБАСТНОЕ ОБНОВЛЕНИЕ PROFILES ---
    // 1. Сначала пытаемся вставить. Если email уникален и его нет -> сработает.
    // 2. Если сработает ошибка (код 23505 - нарушение уникальности) -> значит юзер есть, делаем UPDATE.
    
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        email: email,
        client_status: 'NEW',
        total_orders: 1,
        total_spent: Number(verifiedTotal.toFixed(2))
      }])
      .select('id');

    if (insertError) {
      // Если это ошибка нарушения уникальности, значит профиль УЖЕ существует
      if (insertError.code === '23505') {
        console.log(`[PROFILES] Юзер ${email} уже существует, переходим к обновлению.`);
        
        // Получаем текущие данные для корректного инкремента
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
        throw new Error("Profile insert failed: " + insertError.message);
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
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error("Database insert failed: " + dbError.message);
    const orderId = orderData[0].id;

    // --- СПИСАНИЕ СТОКА ---
    for (const item of verifiedCartItems) {
      const targetSize = String(item.size || 'OS').toUpperCase().trim();
      
      const { data: existingVariants } = await supabaseAdmin
        .from('product_variants')
        .select('*')
        .eq('product_id', item.id);

      if (existingVariants && existingVariants.length > 0) {
        let sizeFound = false;
        const cleanVariants = existingVariants.map((v: any) => {
          const vSize = String(v.size || '').toUpperCase().trim();
          if (vSize === targetSize || (existingVariants.length === 1 && !sizeFound)) {
            sizeFound = true;
            const currentStock = parseInt(v.stock, 10) || 0;
            return { product_id: item.id, size: vSize, stock: Math.max(0, currentStock - item.quantity) };
          }
          return { product_id: item.id, size: vSize, stock: Math.max(0, parseInt(v.stock, 10) || 0) };
        });

        await supabaseAdmin.from('product_variants').delete().eq('product_id', item.id);
        await supabaseAdmin.from('product_variants').insert(cleanVariants);

        const totalStock = cleanVariants.reduce((acc, v) => acc + (v.stock || 0), 0);
        await supabaseAdmin
          .from('products')
          .update({ status: totalStock <= 0 ? 'soldout' : 'ACTIVE' })
          .eq('id', item.id);
      }
    }

    // --- EMAIL И TELEGRAM (ОСТАВЛЕНО БЕЗ ИЗМЕНЕНИЙ) ---
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