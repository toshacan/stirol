import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PUBLIC_PRODUCT_WITH_VARIANTS_FIELDS } from '@/lib/storefrontProducts';

// Кэшируем на 60 секунд — админка не заходит сюда чаще, а свежие правки
// из add/update/delete-product сбрасывают кэш немедленно через revalidatePath
export const revalidate = 60;

export async function GET() {
  try {
    // This route is public: only return fields required by the storefront.
    const { data, error } = await supabase
      .from('products')
      .select(PUBLIC_PRODUCT_WITH_VARIANTS_FIELDS)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Unexpected Error:', error);
    const message = error instanceof Error ? error.message : 'Unable to fetch products.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
