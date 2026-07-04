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
    
    // Берем строго существующие колонки: id, title, price
    const { data: realProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, title, price')
      .in('id', productIds);

    if (prodError || !realProducts) {
      console.error("💥 DB Products Error:", prodError);
      throw new Error('Failed to verify products price from database: ' + (prodError?.message || 'Unknown DB error'));
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

    // --- СПИСАНИЕ СТОКА 1:1 КАК В ТВОЕМ UPDATE-PRODUCT ---
    for (const item of verifiedCartItems) {
      const targetSize = String(item.size || 'OS').toUpperCase().trim();
      console.log(`[STOCK] Списание для товара ID=${item.id}, Размер=${targetSize}, Кол-во=${item.quantity}`);

      // 1. Получаем все варианты из product_variants
      const { data: existingVariants, error: fetchErr } = await supabaseAdmin
        .from('product_variants')
        .select('*')
        .eq('product_id', item.id);

      if (fetchErr) {
        console.error(`[ERROR] Не удалось загрузить варианты для ${item.id}:`, fetchErr);
        continue;
      }

      if (existingVariants && existingVariants.length > 0) {
        let sizeFound = false;

        // 2. Пересчитываем остатки
        const cleanVariants = existingVariants.map((v: any) => {
          const vSize = String(v.size || '').toUpperCase().trim();
          // Совпадает размер ИЛИ это единственный вариант у товара (например OS)
          if (vSize === targetSize || (existingVariants.length === 1 && !sizeFound)) {
            sizeFound = true;
            const currentStock = parseInt(v.stock, 10) || 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            console.log(`[STOCK] Обновляем размер ${vSize}: старый сток ${currentStock} -> новый ${newStock}`);
            return {
              product_id: item.id,
              size: vSize || 'OS',
              stock: newStock
            };
          }
          return {
            product_id: item.id,
            size: vSize,
            stock: Math.max(0, parseInt(v.stock, 10) || 0)
          };
        });

        // 3. Чистим старые и вставляем обновленные (ровно как в твоем update-product)
        const { error: delErr } = await supabaseAdmin
          .from('product_variants')
          .delete()
          .eq('product_id', item.id);

        if (delErr) {
          console.error(`[ERROR] Ошибка удаления старых вариантов для ${item.id}:`, delErr);
        } else {
          const { error: insErr } = await supabaseAdmin
            .from('product_variants')
            .insert(cleanVariants);

          if (insErr) {
            console.error(`[ERROR] Ошибка вставки новых вариантов для ${item.id}:`, insErr);
          } else {
            console.log(`[SUCCESS] Сток успешно перезаписан для товара ${item.id}`);
          }
        }

        // 4. Авто-обновление статуса товара
        const totalStock = cleanVariants.reduce((acc, v) => acc + (v.stock || 0), 0);
        if (totalStock <= 0) {
          await supabaseAdmin
            .from('products')
            .update({ status: 'soldout' })
            .eq('id', item.id);
          console.log(`[STATUS] Товар ${item.id} переведен в Sold Out`);
        } else {
          await supabaseAdmin
            .from('products')
            .update({ status: 'ACTIVE' })
            .eq('id', item.id);
        }
      } else {
        console.warn(`[WARN] Для товара ID=${item.id} записи в product_variants отсутствуют.`);
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