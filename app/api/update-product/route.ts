import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const product = await request.json();
    let { 
      id, title, price, status, description, description_ua, 
      imagesStr, images, category, position, variants, colorVariants, color_variants 
    } = product;

    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    // Жесткая очистка цены от дублирующихся знаков евро (например, "80€€" -> "80€")
    const rawPriceStr = String(price || '0').replace(/[^0-9.]/g, '');
    const cleanPrice = rawPriceStr ? `${rawPriceStr}€` : '0€';

    // Обработка картинок
    let imagesArray: string[] = [];
    if (typeof imagesStr === 'string' && imagesStr.trim() !== '') {
      imagesArray = imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(images)) {
      imagesArray = images.map((s: any) => String(s).trim());
    }

    // Обработка позиции (принудительное число)
    const finalPosition = parseInt(String(position || 0), 10);

    // Автоматическая корректировка статуса на бэкенде на основе переданных размеров
    if (variants && Array.isArray(variants)) {
      const totalStock = variants.reduce((acc: number, v: any) => acc + (parseInt(String(v.stock || 0), 10) || 0), 0);
      if (totalStock === 0 && variants.length > 0) {
        status = 'soldout';
      } else if (status === 'soldout' && totalStock > 0) {
        status = null; // Если товары появились в наличии, сбрасываем статус soldout на доступный
      }
    }

    // Подготовка объекта для апсерта
    const productData = {
      id: String(id).trim(),
      title: title || '',
      price: cleanPrice,
      status: status || null,
      description: description || '',
      description_ua: description_ua || '',
      images: imagesArray,
      category: category || 'tshirts',
      position: isNaN(finalPosition) ? 0 : finalPosition,
      color_variants: colorVariants || color_variants || []
    };

    // 3. Сохранение товара в базу
    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productData);

    if (prodError) {
      console.error("Supabase Error:", prodError);
      throw new Error('Failed to save product: ' + prodError.message);
    }

    // 4. Обновление размеров (variants)
    if (variants && Array.isArray(variants)) {
      await supabaseAdmin.from('product_variants').delete().eq('product_id', String(id).trim());
      
      const variantsToInsert = variants.map((v: any) => ({
        product_id: String(id).trim(),
        size: String(v.size || 'OS').toUpperCase().trim(),
        stock: parseInt(String(v.stock || 0), 10)
      }));

      if (variantsToInsert.length > 0) {
        await supabaseAdmin.from('product_variants').insert(variantsToInsert);
      }
    }

    revalidatePath('/api/get-products');
    revalidatePath('/shop');
    revalidatePath(`/shop/${id}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("💥 Product Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}