import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const { 
      id, title, price, status, description, description_ua, 
      imagesStr, images, category, position, variants, colorVariants, color_variants 
    } = product;

    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    // Обработка картинок
    let imagesArray: string[] = [];
    if (typeof imagesStr === 'string' && imagesStr.trim() !== '') {
      imagesArray = imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(images)) {
      imagesArray = images.map((s: any) => String(s).trim());
    }

    // Обработка позиции (принудительное число)
    const finalPosition = parseInt(String(position || 0), 10);

    // Подготовка объекта для апсерта
    const productData = {
      id: String(id).trim(),
      title: title || '',
      price: price || '0€',
      status: status || null,
      description: description || '',
      description_ua: description_ua || '',
      images: imagesArray,
      category: category || 'tshirts',
      position: isNaN(finalPosition) ? 0 : finalPosition, // Явно передаем число
      color_variants: colorVariants || color_variants || []
    };

    // 3. Сохранение в базу
    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productData); // upsert сам определит, есть ли запись по ID

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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("💥 Product Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}